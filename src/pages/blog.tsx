import React, { FC } from "react"
import { Layout } from "../components/layout"
import { BlogListing } from "../components/BlogListing"
import { graphql } from "gatsby"
import { SEO } from "../components/seo"

interface BlogIndexProps {
  data: {
    allMarkdownRemark: {
      edges: ContentDetailNode[]
    }
  }
}

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

export const BlogIndex: FC<BlogIndexProps> = function({ data }) {
  const posts = data.allMarkdownRemark.edges

  return (
    <Layout>
      <section className="mt-16 md:mt-64">
        <SEO
          title="Mario's Writings"
          keywords={["blog", "gatsby", "javascript", "react"]}
        />
        <h1 className="text-4xl md:text-6xl ml-7 md:ml-25vw pt-8 font-heading mb-12">
          Mario's Writings
        </h1>
        {posts.map((post, index) => (
          <BlogListing
            post={post}
            index={index}
            key={post.node.frontmatter.title}
          />
        ))}
      </section>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          timeToRead
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            category
            description
            image
          }
        }
      }
    }
  }
`
