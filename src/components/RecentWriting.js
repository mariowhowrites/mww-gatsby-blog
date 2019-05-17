import React from "react"
import { Link } from "gatsby"

export default function RecentWriting({ post }) {
  const latestPost = post.node

  return (
    <section
      className={`flex flex-col bg-orange-500 justify-center min-h-80vh`}
    >
      <div
        className={`md:text-right ml-7 md:ml-0 md:mt-0 mt-8 font-bold text-xl md:text-2xl text-white antialiased w-full md:w-1/4`}
      >
        Recent Writing
      </div>
      <article className={`ml-7 md:ml-25vw md:w-1/2 pt-8 mb-10 flex flex-col`}>
        <h2 className="font-bold text-4xl md:text-5xl font-body mb-4">
          <Link to={latestPost.fields.slug}>{latestPost.frontmatter.title}</Link>
        </h2>
        <p className="font-body text-2xl font-bold opacity-50 mb-6">
          {latestPost.timeToRead} minute read
        </p>
        <p className="font-heading text-2xl">
          {latestPost.frontmatter.description}
        </p>
      </article>
    </section>
  )
}
