import React, { FC } from "react"
import { Link, graphql } from "gatsby"
import { Layout } from "../components/layout"
import { SEO } from "../components/seo"

interface BlogPostTemplateProps {
  data: {
    markdownRemark: {
      excerpt: string
      html: string
      frontmatter: {
        title: string
        date: string
        description: string
        image: string
      }
    }
  }
  pageContext: {
    previous?: PaginationNode
    next?: PaginationNode
    slug: string
  }
}

interface PaginationNode {
  fields: {
    slug: string
  }
  frontmatter: {
    title: string
    category: string
  }
}

const BlogPostTemplate: FC<BlogPostTemplateProps> = function({
  data,
  pageContext,
}) {
  const post = data.markdownRemark
  const { previous, next } = pageContext

  return (
    <Layout>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <article className="mt-20 px-6 md:px-0 md:w-1/2 mx-auto">
        {post.frontmatter.image && (
          <img
            className="mb-8 shadow-2xl rounded-lg"
            src={post.frontmatter.image}
            alt={post.frontmatter.title}
          />
        )}
        <h1 className="font-body font-bold text-3xl md:text-4xl mb-4">
          {post.frontmatter.title}
        </h1>
        <p className="opacity-50 font-bold text-2xl mb-8">
          {post.frontmatter.date}
        </p>
        <div
          id="post-content"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
        <hr />
        <ul className="flex flex-wrap justify-between p-0 py-8 text-xl font-semibold">
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </article>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        image
      }
    }
  }
`
