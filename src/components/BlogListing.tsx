import React, { FC } from "react"
import { Link } from "gatsby"

interface ContentDetailNode {
  node: ContentDetail
}

interface ContentDetail {
  timeToRead: string
  excerpt: string
  fields: {
    slug: string
  }
  frontmatter: {
    date: string
    title: string
    category: string
    description: string
    image: string
  }
}

interface BlogListingProps {
  post: ContentDetailNode
  index: number
}

export const BlogListing: FC<BlogListingProps> = function({ post, index }) {
  const latestPost = post.node

  const bgColor = (function(i: number) {
    const colors = ["beige", "light-black", "green-700"]
    return colors[i % 4]
  })(index)

  const isDark = (function(color: string) {
    return ["light-black", "green-700"].includes(color)
  })(bgColor)

  return (
    <section
      className={`flex flex-col bg-${bgColor} justify-center min-h-screen ${
        isDark ? `text-white` : `text-black`
      }`}
    >
      <div className="md:text-right ml-7 md:ml-0 mt-8 md:mt-16 font-bold text-xl md:text-2xl antialiased w-full md:w-1/4">
        {latestPost.frontmatter.category}
      </div>
      <article className="ml-7 md:ml-25vw md:w-1/2 pt-8 mb-10 flex flex-col pr-16 md:mb-16 mb-8">
        <h2 className="font-bold text-4xl md:text-5xl font-body mb-2 trans-opacity hover:opacity-50">
          <Link to={latestPost.fields.slug}>
            {latestPost.frontmatter.title}
          </Link>
        </h2>
        <p className="font-body text-2xl font-bold opacity-50 mb-6">
          {latestPost.timeToRead} minute read - {latestPost.frontmatter.date}
        </p>
        {latestPost.frontmatter.image && (
          <img
            className="mb-8 shadow-2xl rounded-lg trans-opacity hover:opacity-75 max-h-50vh"
            src={latestPost.frontmatter.image}
            alt={latestPost.frontmatter.title}
          />
        )}
        <p className="font-heading text-2xl">
          {latestPost.frontmatter.description}
        </p>
      </article>
    </section>
  )
}
