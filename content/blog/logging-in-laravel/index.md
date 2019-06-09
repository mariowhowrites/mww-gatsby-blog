---
title: Logging In With Laravel
published: true
description: In which we deep dive into the code powering a login in a typical Laravel application
category: Technical
tags: laravel, php, authentication
image: https://images.unsplash.com/photo-1492571350019-22de08371fd3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1249&q=80
date: "2019-06-05"
---

Welcome to the much-belated Part 2 of my Laravel Authentication series! As promised, in this chapter we'll be diving more into the nuts and bolts of the authentication process. We'll also look at the login process in an attempt to better understand how the authentication process works within a Laravel application.

If you haven't yet read Part 1 of the Authentication with Laravel series, you can find it on Medium [here](https://medium.com/@mariowhowrites/laravel-authentication-under-the-hood-78064b5b89e6).

I'm going to start with the code that's added to a Laravel application once the developer uses the `make:auth` command. From there, we'll work our way from the top on down, looking at the code behind a typical login request before examining the code that makes such a login workflow possible.

## Scaffolding Auth

First, let's look at code powering the `make:auth` command:
```php
// Illuminate\Auth\Console\AuthMakeCommand

/**
* Execute the console command.
*
* @return void
*/
public function handle()
{
    $this->createDirectories();

    $this->exportViews();

    if (! $this->option('views')) {
        file_put_contents(
            app_path('Http/Controllers/HomeController.php'),
            $this->compileControllerStub()
        );

        file_put_contents(
            base_path('routes/web.php'),
            file_get_contents(__DIR__.'/stubs/make/routes.stub'),
            FILE_APPEND
        );
    }

    $this->info('Authentication scaffolding generated successfully.');
}
```
The important part for our purposes is the routes appended to our `web.php` file via `file_put_contents`. This is where Laravel adds the routes powering the default authentication experience.

As it turns out, the appended stub is only two lines long:
```php
Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
```
In an additional convenience, the `routes` method is the only method defined directly on the Auth facade. Examining that method shows that the bulk of our authentication logic is contained in the Router class:
```php
public static function routes(array $options = [])
{
    static::$app->make('router')->auth($options);
}
```
The corresponding Router function accepts an array of options specifying whether registration, reset and verify routes should be included. Using those options, the router adds a number of routes to our application:
```php
// Illuminate\Routing\Router

/**
    * Register the typical authentication routes for an application.
    *
    * @param  array  $options
    * @return void
    */
public function auth(array $options = [])
{
    // Authentication Routes...
    $this->get('login', 'Auth\LoginController@showLoginForm')->name('login');
    $this->post('login', 'Auth\LoginController@login');
    $this->post('logout', 'Auth\LoginController@logout')->name('logout');

    // Registration Routes...
    if ($options['register'] ?? true) {
        $this->get('register', 'Auth\RegisterController@showRegistrationForm')->name('register');
        $this->post('register', 'Auth\RegisterController@register');
    }

    // Password Reset Routes...
    if ($options['reset'] ?? true) {
        $this->resetPassword();
    }

    // Email Verification Routes...
    if ($options['verify'] ?? false) {
        $this->emailVerification();
    }
}
```
Because we're trying to follow the journey of a typical login request, we'll be focused only on the routes that interface with Laravel once a login request has been sent. In particular, we are concerned with the `POST login` route, which redirects to the `LoginController@login` method.

Looking at the Login controller, we don't see much:
```php
class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
    * Where to redirect users after login.
    *
    * @var string
    */
    protected $redirectTo = '/home';

    /**
    * Create a new controller instance.
    *
    * @return void
    */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }
}
```
However, notice that there's an `AuthenticatesUsers` trait, which means any methods available in the trait will also be accessible in this controller. Let's look there and see if we can find a `login` method:
```php
// Illuminate\Foundation\Auth\AuthenticatesUsers

/**
    * Handle a login request to the application.
    *
    * @param  \Illuminate\Http\Request  $request
    * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\Response|\Illuminate\Http\JsonResponse
    *
    * @throws \Illuminate\Validation\ValidationException
    */
public function login(Request $request)
{
    $this->validateLogin($request);

    // If the class is using the ThrottlesLogins trait, we can automatically throttle
    // the login attempts for this application. We'll key this by the username and
    // the IP address of the client making these requests into this application.
    if ($this->hasTooManyLoginAttempts($request)) {
        $this->fireLockoutEvent($request);

        return $this->sendLockoutResponse($request);
    }

    if ($this->attemptLogin($request)) {
        return $this->sendLoginResponse($request);
    }

    // If the login attempt was unsuccessful we will increment the number of attempts
    // to login and redirect the user back to the login form. Of course, when this
    // user surpasses their maximum number of attempts they will get locked out.
    $this->incrementLoginAttempts($request);

    return $this->sendFailedLoginResponse($request);
}
```
Fortunately, as with much of the Laravel source code, the top-level API utilizes descriptive method names to resemble the plain-language description of the workflow as closely as possible. 

First, the login request is validated. We need to make sure that a username and password are included, and that both are strings:
```php
protected function validateLogin(Request $request)
{
    $request->validate([
        $this->username() => 'required|string',
        'password' => 'required|string',
    ]);
}
```
From there, we move onto login throttling. As specified in [the authentication docs](https://laravel.com/docs/5.8/authentication#login-throttling), login throttling prevents a user from spamming your server with login requests if they've failed to login multiple times. 

Here is the `hasTooManyLoginAttempts` method:
```php
protected function hasTooManyLoginAttempts(Request $request)
{
    return $this->limiter()->tooManyAttempts(
        $this->throttleKey($request), $this->maxAttempts()
    );
}
```
We see that the brunt of the throttling logic is delegated to the class returned by `limiter()`, which is an instance of Laravel's `Cache/RateLimiter`. Before looking at that, let's inspect the two methods we can find in `ThrottlesLogins`: `throttleKey` and `maxAttempts`.
```php
protected function throttleKey(Request $request)
{
    return Str::lower($request->input($this->username())).'|'.$request->ip();
}
```
We see that a throttle key is created by combining the username provided in the login request (by default, this is the user's email) with the IP address of the device from which the user is logging in.

Next, `maxAttempts()`:
```php
public function maxAttempts()
{
    return property_exists($this, 'maxAttempts') ? $this->maxAttempts : 5;
}
```
This one's fairly self-explanatory: unless the developer has defined a custom `maxAttempts` property, a default value of 5 is used. Keep in mind that you would define this property on the `LoginController` within your application, and not on the `ThrottlesLogins` trait itself. As the `LoginController` uses both the `ThrottlesLogins` and `AuthenticatesUsers` traits, any properties available on the controller are also available to its traits.

With this in mind, let's look at the `tooManyAttempts` method in `Cache/RateLimiter`:
```php
public function tooManyAttempts($key, $maxAttempts)
{
    if ($this->attempts($key) >= $maxAttempts) {
        if ($this->cache->has($key.':timer')) {
            return true;
        }

        $this->resetAttempts($key);
    }

    return false;
}
```
We see that the `RateLimiter` class makes extensive use of Laravel's native cache functionality. It uses the `throttleKey` defined above to check the cache and see whether the user has logged in too many times. If they have, and there's still a timer on that particular key, `tooManyAttempts` returns true and the user is denied entry. Otherwise, if there's no timer on the user's throttle key, this means that their throttling period has expired. In this case, the `RateLimiter` resets the user's login attempts to give them a clean slate and avoid throttling based on stale attempts.

Of course, if `true` is returned from the `tooManyAttempts` method, the user isn't allowed to login, and Laravel responds accordingly. First, a new `Lockout` event is fired using Laravel's event system. After that, the user is sent a lockout response, specifying the number of seconds until another attempt is permitted:
```php
protected function sendLockoutResponse(Request $request)
{
    $seconds = $this->limiter()->availableIn(
        $this->throttleKey($request)
    );

    throw ValidationException::withMessages([
        $this->username() => [Lang::get('auth.throttle', ['seconds' => $seconds])],
    ])->status(429);
}
```
### Defensive Programming

By this point, having confirmed that the user has supplied login information and is not currently locked out, the authentication processes we've studied in the first chapter come into play. This logic is encapsulated at this point in the `LoginController@login` method:
```php
if ($this->attemptLogin($request)) {
    return $this->sendLoginResponse($request);
}
```
Notice how the "happy path" is encapsulated within its own conditional logic: a good example of defensive programming.

In plain English, here's what the above means. The "happy path" for any piece of code is what happens when everything goes as planned. It's the golden brick road, the mythical destination where we as developers realize there's no place like a good user experience. 

In our case, the "happy path" is a successful login: the user provides the correct credentials and is allowed access to our application. The `sendLoginResponse` method contains the necessary actions for the happy path to occur. It is thus important that this method is found only within a conditional. If, and only if, the return value of `attemptLogin()` is truthy, then our users can follow the happy path.

Let's look at this code with a bit more context:
```php
if ($this->attemptLogin($request)) {
    return $this->sendLoginResponse($request);
}

$this->incrementLoginAttempts($request);

return $this->sendFailedLoginResponse($request);
```
If the users follow the happy path, the `incrementLoginAttempts` and `sendFailedLoginResponse` methods are never called, as execution stops on the `sendLoginResponse` method instead.

Therefore, if the user has reached the point where `incrementLoginAttempts` is being called, then we know that the login attempt has not been successful. 

The crux of this strategy, and of defensive programming in general, is the assumption of failure. The happy path is guarded with a conditional, and defensive programming assumes that this condition returns falsy. The main benefit of this approach is that it's better to accidentally deny a successful login than to accidentally allow a fraudulent login. 

There is little downside to accidentally denying valid logins: your users can always try again. By contrast, allowing illegitimate access because your program assumed the happy path can result in your website's accounts being compromised.

In this way, defensive programming is a lot like defensive driving: assuming the worst and planning accordingly is your best chance at success, no matter the outcome.

### Attempting a Login

With that aside covered, let's look at the actual login attempt code:
```php
protected function attemptLogin(Request $request)
{
    return $this->guard()->attempt(
        $this->credentials($request),
        $request->filled('remember')
    );
}
```
To perform our authentication check, we use the credentials provided by the request and the `credentials()` method:
```php
protected function credentials(Request $request)
{
    return $request->only($this->username(), 'password');
}
```
By default, `username()` returns `email`, which means that the user's email and password are used in the auth check. 

Here is the first major difference between the login auth process and the code we examined in the first chapter: while we were previously examining the `TokenGuard`, the default guard for login attempts is the `SessionGuard`. Let's take a look at the `SessionGuard@attempt` method:
```php
public function attempt(array $credentials = [], $remember = false)
{
    $this->fireAttemptEvent($credentials, $remember);

    $this->lastAttempted = $user = $this->provider->retrieveByCredentials($credentials);

    if ($this->hasValidCredentials($user, $credentials)) {
        $this->login($user, $remember);

        return true;
    }

    $this->fireFailedEvent($user, $credentials);

    return false;
}
```
Notice defensive programming at work: only if the user has valid credentials are they logged in. Otherwise, a failed login event is fired and the user is denied access. As before, by assuming failure as the default, this method reduces the possibility of false positives and protects user data as a result.

Besides that, there are three major functions to look at here: `retrieveByCredentials`, `hasValidCredentials`, and `login`.

`retrieveByCredentials` is attached to the guard's provider. As we learned in the last chapter, providers are responsible for defining how your application defines a "user" within the context of authentication. Laravel provides two providers out of the box. Both attempt to fetch a user from your database, but they differ on how to create a user from a database row:

1. The `eloquent` driver casts your user into an Eloquent model.
2. The `database` driver casts your user into a `GenericUser` model, which is a simple class wrapper around a database row containing only the necessary methods for authentication.

The `eloquent` driver is default, so we'll look at that first:
```php
// within Illuminate\Auth\EloquentUserProvider...

public function retrieveByCredentials(array $credentials)
{
    if (empty($credentials) ||
        (count($credentials) === 1 &&
        array_key_exists('password', $credentials))) {
        return;
    }

    // First we will add each credential element to the query as a where clause.
    // Then we can execute the query and, if we found a user, return it in a
    // Eloquent User "model" that will be utilized by the Guard instances.
    $query = $this->newModelQuery();

    foreach ($credentials as $key => $value) {
        if (Str::contains($key, 'password')) {
            continue;
        }

        if (is_array($value) || $value instanceof Arrayable) {
            $query->whereIn($key, $value);
        } else {
            $query->where($key, $value);
        }
    }

    return $query->first();
}
```
First, we ensure that we have enough information to fetch a user. As a user cannot be fetched by an unhashed password alone, the method returns null if only a password is provided.

Next, a new Eloquent query is created using whatever model you define alongside the `eloquent` driver. In the vast majority of cases, this will be the default `User` model that comes with all Laravel applications. 

From there, for each value provided in the `credentials` array, a new `WHERE` clause is added to the query. The first database entry that matches the resulting query is returned as a User model.

Let's compare this against the `retrieveByCredentials` method in the `DatabaseUserProvider`:
```php
// In Illuminate\Auth\DatabaseUserProvider

public function retrieveByCredentials(array $credentials)
{
    if (empty($credentials) ||
        (count($credentials) === 1 &&
        array_key_exists('password', $credentials))) {
        return;
    }

    // First we will add each credential element to the query as a where clause.
    // Then we can execute the query and, if we found a user, return it in a
    // generic "user" object that will be utilized by the Guard instances.
    $query = $this->conn->table($this->table);

    foreach ($credentials as $key => $value) {
        if (Str::contains($key, 'password')) {
            continue;
        }

        if (is_array($value) || $value instanceof Arrayable) {
            $query->whereIn($key, $value);
        } else {
            $query->where($key, $value);
        }
    }

    // Now we are ready to execute the query to see if we have an user matching
    // the given credentials. If not, we will just return nulls and indicate
    // that there are no matching users for these given credential arrays.
    $user = $query->first();

    return $this->getGenericUser($user);
}
```
As before, we abort if there are not enough credentials to successfully fetch a user. Unlike with the `EloquentUserProvider`, we establish a direct connection to our database instead of relying on Eloquent to manage the connection for us.

Once the connection has been established, the query itself is set up in a similar manner to `EloquentUserProvider`. The main difference is the return value of the query's `first` method. Instead of a User model, we are instead given the raw values returned from the database. Working with raw arrays can be clunky and error-prone, however, so the queried array is cast into a `GenericUser` model before being returned to the SessionGuard.

With any luck, the above explanation demonstrates how different providers use different data sources and methods to accomplish the same result. While the `retrieveByCredentials` method on both providers ultimately returns a user object, the two classes differ in how they choose to query the database and construct their user objects.

### Validating Credentials

With our user in hand, it's time to check their password. This is handled by the SessionGuard's `hasValidCredentials` method:
```php
protected function hasValidCredentials($user, $credentials)
{
    return ! is_null($user) && $this->provider->validateCredentials($user, $credentials);
}
```
If `retrieveByCredentials` didn't return a user, we can safely assume that the given credentials are invalid, and we return false. Otherwise, the responsibility for determining how to validate the credentials is passed off to the provider. In this case, the two providers implement the method in exactly the same way:
```php
public function validateCredentials(UserContract $user, array $credentials)
{
    $plain = $credentials['password'];

    return $this->hasher->check($plain, $user->getAuthPassword());
}
```
Now, cryptography is an interesting and useful subject, but if we were to include an intro to cryptography in this column the reading time would span well over an hour. Suffice it to say for now that the `hasher@check` method returns either 'true' or 'false' depending on whether the provided password matches the password on record.

## Mission Success: Logging In

At this point, if the user has passed the hasher check and reached the `login` method, the login attempt has been successful. From here, the SessionGuard transitions into doing the work necessary to log the user into your application.
```php
/**
* Log a user into the application.
*
* @param  \Illuminate\Contracts\Auth\Authenticatable  $user
* @param  bool  $remember
* @return void
*/
public function login(AuthenticatableContract $user, $remember = false)
{
    $this->updateSession($user->getAuthIdentifier());

    // If the user should be permanently "remembered" by the application we will
    // queue a permanent cookie that contains the encrypted copy of the user
    // identifier. We will then decrypt this later to retrieve the users.
    if ($remember) {
        $this->ensureRememberTokenIsSet($user);

        $this->queueRecallerCookie($user);
    }

    // If we have an event dispatcher instance set we will fire an event so that
    // any listeners will hook into the authentication events and run actions
    // based on the login and logout events fired from the guard instances.
    $this->fireLoginEvent($user, $remember);

    $this->setUser($user);
}
```
First, because this is the SessionGuard, our application updates the user's session to reflect their successful login.
```php
/**
* Update the session with the given ID.
*
* @param  string  $id
* @return void
*/
protected function updateSession($id)
{
    $this->session->put($this->getName(), $id);

    $this->session->migrate(true);
}
```
A new session value is added with the user's ID to let our application know that this user is logged in. From there, the session is renewed using `migrate` to force our app to refresh and acknowledge our changes.

I'm going to skip the logic behind the remember token process, as it's rather intricate, requires some knowledge of how cookies work, and ultimately not directly related to whether a user actually is who they claim to be. 

Besides the event methods, which don't directly affect the login process, the only function remaining in the `login` method is `setUser`. The sole responsibility of this method is to save some information about the user and the login attempt in memory so that the user doesn't have to be loaded again should this class be called later on in the app lifecycle.

With this, the `login` function stops execution, effectively ending the login process. The `true` value is returned from the guard's `attempt` method, which then causes the the `attemptLogin` method in our LoginController to return true as well. At this point, the only thing left to do is to send the user a successful login response:
```php
// Illuminate\Foundation\Auth\AuthenticatesUsers

/**
* Send the response after the user was authenticated.
*
* @param  \Illuminate\Http\Request  $request
* @return \Illuminate\Http\Response
*/
protected function sendLoginResponse(Request $request)
{
    $request->session()->regenerate();

    $this->clearLoginAttempts($request);

    return $this->authenticated($request, $this->guard()->user())
            ?: redirect()->intended($this->redirectPath());
}
```
Remember that our application's session was reset after we stored the user's ID. By refreshing the request's session, we guarantee that the request session is fully in sync with the application session. This means that calls to `$request->session()` that happen after our user has logged in will correctly state that the user is authenticated.

The last step depends on your application. If you've defined an `authenticated` method in your LoginController, that method will take over from here. This is good if you want to implement some custom logic that's more advanced than a simple redirect.

Otherwise, your user is redirected using the `RedirectsUsers` trait:
```php
// Illuminate\Foundation\Auth\RedirectsUsers

/**
* Get the post register / login redirect path.
*
* @return string
*/
public function redirectPath()
{
    if (method_exists($this, 'redirectTo')) {
        return $this->redirectTo();
    }

    return property_exists($this, 'redirectTo') ? $this->redirectTo : '/home';
}
```
If there's a `redirectTo` method on your controller, this trait will call it and redirect users to whatever the return value is. This could be helpful if your application has different tiers of users that should be directed to different places - subscribers to `/subscribers/` and regular users to `/dashboard/`, for instance.

Otherwise, if a `redirectTo` property exists, that will be the redirect target. In case neither a method nor a property exists, the default redirect path is to `/home`. Personally, I never end up using the `/home` route in my own applications, so I recommend that you define your custom `redirectTo` property to fit your application. 

## Wrapping Up

Hopefully this journey through the lifecycle of a Laravel login has been illustrative. We've taken the opportunity not only to examine how the authentication process works at a high level, but also how the different drivers and guards available within Laravel can customize individual steps of a process while creating the same end result.

Should you have any more requests for similar walkthroughs, please don't hesitate to reach out to me @mariowhowrites on Twitter, Medium, Practical Dev, or my own [website](https://mariowhowrites.com).