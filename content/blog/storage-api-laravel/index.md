---
title: "Files and Decorators: Studying Storage in Laravel"
published: true
description: Examining the design and implementation of Laravel's Storage API
tags: php, laravel, data structures, flysystem
image: https://images.unsplash.com/photo-1480515883589-dcaa74351fd6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1330&q=80
category: Technical
date: "2019-06-04"
---

I've been working on a project in Laravel that requires substantial work with files — specifically, images. Uploading, downloading, copying, moving and deleting images is a crucial part of what makes this application tick.

At a certain point, I realized that I didn't know nearly as much as I wanted to about how my application processed images. I knew what was outlined in the documentation, sure, but not much else beyond that. I had heard of PHP's Flysystem package through my work with Laravel and [Statamic](https://statamic.com/), but I didn't know why this package was so popular or how it worked at a core level. This lack of knowledge left me in a tough position when the business logic I needed to write went beyond the functionality covered in Laravel's Storage API.

For this reason, I decided to do a bit of digging. I've still got to finish my series on Authentication and Tailwind CSS, so I'm going to leave an extended series on Filesystems for another time. The point of this writeup is primarily to share the notes I've taken on how the Storage API of Laravel works under the hood. Along the way, I hope to connect the sometimes-abstract world of data structures with actual implementations to show how you can use these patterns in your own applications.

## Storage from the Top Down

At the most general level, my goal in studying the Storage API was to connect the dots between the framework-level business logic I write and the actual business of working with images. More specifically, I wanted to find out how Laravel was able to wrap abstract concepts such as directories, permissions, URLs, etc into an API that works across concrete implementations. How is it that I can write the same code to work with images stored on my computer _and_ images stored in an Amazon data center halfway across the world?

To figure this out, I had two choices — work from the bottom up or the top down. While both approaches would have worked well for my purposes, I ultimately decided to work from the top down. This allowed me to keep track of the methods and classes I used in my own project and follow them down the the lowest level I feel comfortable exploring: native PHP functions. (One day I will summon the courage to study the C code behind the PHP interpreter, but today is not that day.)

So, let's look at some code! The first method you're likely familiar with is the `Storage::disk` method. The Storage facade defers to the FilesystemManager class, as we can see in the docblock for the facade:

```php
/**
    * @method static \Illuminate\Contracts\Filesystem\Filesystem disk(string $name = null)
    *
    * @see \Illuminate\Filesystem\FilesystemManager
    */
class Storage extends Facade
{
    // facade here
```

And here's the `disk` method on the FilesystemManager class:

```php
/**
    * Get a filesystem instance.
    *
    * @param  string  $name
    * @return \Illuminate\Contracts\Filesystem\Filesystem
    */
public function disk($name = null)
{
    $name = $name ?: $this->getDefaultDriver();

    return $this->disks[$name] = $this->get($name);
}

/**
    * Attempt to get the disk from the local cache.
    *
    * @param  string  $name
    * @return \Illuminate\Contracts\Filesystem\Filesystem
    */
protected function get($name)
{
    return $this->disks[$name] ?? $this->resolve($name);
}
```

If a disk has already been loaded before, it is found in the `disks` property, saving the need to load a disk twice. If the disk were not stored in memory using the `disks` property, the same disk would be loaded again every time you called the `Storage` facade, which would not be great from a performance standpoint.

Let's look at the `resolve` method:

```php
/**
    * Resolve the given disk.
    *
    * @param  string  $name
    * @return \Illuminate\Contracts\Filesystem\Filesystem
    *
    * @throws \InvalidArgumentException
    */
protected function resolve($name)
{
    $config = $this->getConfig($name);

    if (isset($this->customCreators[$config['driver']])) {
        return $this->callCustomCreator($config);
    }

    $driverMethod = 'create'.ucfirst($config['driver']).'Driver';

    if (method_exists($this, $driverMethod)) {
        return $this->{$driverMethod}($config);
    } else {
        throw new InvalidArgumentException("Driver [{$config['driver']}] is not supported.");
    }
}

/**
    * Get the filesystem connection configuration.
    *
    * @param  string  $name
    * @return array
    */
protected function getConfig($name)
{
    return $this->app['config']["filesystems.disks.{$name}"];
}
```

The first thing that happens here is that we load the necessary configuration from our Laravel application setup. This is stored in a file called `filesystems.php`, in which a typical disk looks like this:

```php
'disks' => [

    'public' => [
        'driver' => 'local',
    'root' => storage_path('app/public'),
    'url' => env('APP_URL') . '/storage',
    'visibility' => 'public',
    ],

    's3' => [
    'driver' => 's3',
    'key' => env('AWS_ACCESS_KEY_ID'),
    'secret' => env('AWS_SECRET_ACCESS_KEY'),
    'region' => env('AWS_DEFAULT_REGION'),
    'bucket' => env('AWS_BUCKET'),
    'url' => env('AWS_URL'),
    ],

],
```

Depending on the disk type, this configuration contains keys such as `visibility`, `url`, `region`, and so on.

First, Laravel checks to see whether a custom filesystem is registered under the driver name passed to `Storage::disk`. If so, the custom filesystem is used, skipping most of Laravel's default functionality.

If there isn't a custom drive, Laravel next checks to see whether it has a default driver available for the specified disk. If we're using the local driver, for example, the class will look for a `createLocalDriver` function, which exists and can be found here:

```php
/**
    * Create an instance of the local driver.
    *
    * @param  array  $config
    * @return \Illuminate\Contracts\Filesystem\Filesystem
    */
public function createLocalDriver(array $config)
{
    $permissions = $config['permissions'] ?? [];

    $links = ($config['links'] ?? null) === 'skip'
        ? LocalAdapter::SKIP_LINKS
        : LocalAdapter::DISALLOW_LINKS;

    return $this->adapt($this->createFlysystem(new LocalAdapter(
        $config['root'], $config['lock'] ?? LOCK_EX, $links, $permissions
    ), $config));
}
```

The important logic for our purposes is the last statement with the return value.

I'm gonna copy it again, but with more indentation to make the hierarchy a bit clearer:

```php
$this->adapt(
    $this->createFlysystem(
        new LocalAdapter(
            $config['root'],
            $config['lock'] ?? LOCK_EX,
            $links,
            $permissions
        ),
        $config
    )
);
```

We can see that there are three primary levels to this function. Working from the bottom up:

1. A `LocalAdapter` is created. This is the Flysystem class that handles the nitty-gritty of actually working with local files.
2. The created adapter is then passed into `createFlysystem`, which wraps the adapter in Flysystem's Filesystem class. This Filesystem class handles some of the more general filesystem work — normalizing path strings, reading and acting on config options, and so on.
3. The resulting filesystem is then handed off to the `adapt` method. This creates a Laravel-specific wrapper that allows Flysystem to integrate fully with the Laravel framework.

In essence, this function contains the primary hierarchy that comprises the Storage API. It's also worth noting here that this setup is an excellent example of the **decorator** pattern.

## Decorators and Russian Nesting Dolls

The decorator pattern is kind of similar to Russian nesting dolls. A smaller base object is encapsulated in a slightly larger object, which retains all of the functionality of the smaller object and adds a few methods of its own.

![Russian nesting dolls.](https://images.unsplash.com/photo-1480515883589-dcaa74351fd6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1330&q=80)

Pictured: Russian nesting dolls. Like software development, with more colors and fewer edge cases.

Notice that only the bottommost level — the Flysystem adapter — is actually capable of manipulating files. Yet, by itself, the adapter isn't capable of interfacing with Laravel in an intuitive manner that developers could pick up without writing lots of boilerplate themselves. One potential solution to this would be to fork the Flysystem package and add the necessary functionality directly to Flysystem, but this approach comes with plenty of downsides. In addition to freezing Laravel's Flysystem fork out from any updates that might be added to Flysystem in the future, this approach would add lots of additional code to the Flysystem package that would make future changes very cumbersome.

This is a perfect place to deploy the decorator pattern. By wrapping the Flysystem package with classes providing additional methods and properties, the underlying package can be used as-is while still providing a fluid and intuitive API for Laravel developers.

To illustrate this, let's look at one of the most basic tasks you can do with an image: store it. Remembering that the top-down hierarchy is something like `Laravel Filesystem -> Flysystem -> Flysystem Adapter`, we'll first look at the `put` method in the Laravel class returned by the `adapt` method above, `FilesystemAdapter`:

```php
// Illuminate\Filesystem\FilesystemAdapter

/**
    * Write the contents of a file.
    *
    * @param  string  $path
    * @param  string|resource  $contents
    * @param  mixed  $options
    * @return bool
    */
public function put($path, $contents, $options = [])
{
    $options = is_string($options)
                    ? ['visibility' => $options]
                    : (array) $options;

    // If the given contents is actually a file or uploaded file instance than we will
    // automatically store the file using a stream. This provides a convenient path
    // for the developer to store streams without managing them manually in code.
    if ($contents instanceof File ||
        $contents instanceof UploadedFile) {
        return $this->putFile($path, $contents, $options);
    }

    return is_resource($contents)
            ? $this->driver->putStream($path, $contents, $options)
            : $this->driver->put($path, $contents, $options);
}
```

The business logic stored in this example matches what we could potentially expect from Laravel classes: helpers to make sure developers travel along the "happy path" to productivity. Different branches are provided in case the method encounters a file or a stream, ensuring that `put` can be used with any type of resource.

Notice, however, that ultimately the work of storing the image is passed off to the `driver->put` method. The `driver` in this case represents the Flysystem Filesystem class, so let's look at the `put` method there:

```php
// League\Flysystem\Filesystem

/**
    * Create a file or update if exists.
    *
    * @param string $path     The path to the file.
    * @param string $contents The file contents.
    * @param array  $config   An optional configuration array.
    *
    * @return bool True on success, false on failure.
    */
public function put($path, $contents, array $config = [])
{
    $path = Util::normalizePath($path);
    $config = $this->prepareConfig($config);

    if ( ! $this->getAdapter() instanceof CanOverwriteFiles && $this->has($path)) {
        return (bool) $this->getAdapter()->update($path, $contents, $config);
    }

    return (bool) $this->getAdapter()->write($path, $contents, $config);
}
```

Without diving too deep into the source code, we can see a couple things about the logic in this function. First, there's no mention of anything we might associate with Laravel — no branching paths, no Illuminate classes, etc. Keeping in mind that the Filesystem class is used across all different types of filesystems, from local to S3 and beyond, we see that the logic here is the kind of prep work that needs to be done for any path-based storage system. The path is normalized using `Util::normalizePath`, any necessary config for the adapter is formatted with `prepareConfig`, and then a method on the underlying adapter is called depending on whether the method should override existing content or not.

It's worth keeping in mind that any of the methods here can be called in Laravel by using the `getDriver()` method on a Storage API. So, if for some reason you wanted to call Flysystem's `put` directly instead of using Laravel's `put` method, you could do so by calling `Storage::disk('your-disk')->getDriver()->put()`.

Finally, we see that this `put` method calls methods on the underlying Adapter instance by using `getAdapter`. As the adapter you're using will depending on which filesystem you're using, this method will look different if you're storing files locally vs storing them on AWS S3. We'll look at the LocalAdapter implementation for now:

```php
//

/**
* Write a new file.
*
* @param string $path
* @param string $contents
* @param Config $config   Config object
*
* @return array|false false on failure file meta data on success
*/
public function write($path, $contents, Config $config)
{
    $location = $this->applyPathPrefix($path);
    $this->ensureDirectory(dirname($location));

    if (($size = file_put_contents($location, $contents, $this->writeFlags)) === false) {
        return false;
    }

    $type = 'file';
    $result = compact('contents', 'type', 'size', 'path');

    if ($visibility = $config->get('visibility')) {
        $result['visibility'] = $visibility;
        $this->setVisibility($path, $visibility);
    }

    return $result;
}

/**
* Set the visibility for a file.
*
* @param string $path
* @param string $visibility
*
* @return array|false file meta data
*/
public function setVisibility($path, $visibility)
{
    $location = $this->applyPathPrefix($path);
    $type = is_dir($location) ? 'dir' : 'file';
    $success = chmod($location, $this->permissionMap[$type][$visibility]);

    if ($success === false) {
        return false;
    }

    return compact('path', 'visibility');
}
```

This is the point in the code where files are actually stored on your filesystem using PHP's native function `file_put_contents`. Here, the path and contents provided by the developer are combined with the writeFlags defined by Laravel when it created the LocalAdapter within the FilesystemManager.

Similarly, the visibility of the file is set using PHP's `chmod` function, which works in a nearly identical fashion to Linux's 'chmod' command.

## Wrapping Up

By tracing the stack involved in storing images with Laravel, we've hopefully learned two things: how the Storage API works, and how the architecture of the Storage API follows the decorator paradigm. At each level of the API, the class does some preparatory work before passing responsibility off to the API below it. The end result is that your file is stored in the correct location within your application and the necessary information is returned for you as the developer to take action on — all with a single line of code.