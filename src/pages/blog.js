import React from "react"
import Layout from "../components/layout"
import BlogListing from "../components/BlogListing"
import { graphql } from "gatsby"
import SEO from "../components/seo"

export default function BlogIndex(props) {
  const location = props.location

  const posts = props.data.allMarkdownRemark.edges

  return (
    <Layout location={location} title={props.data.site.siteMetadata.title}>
      <section class="mt-16 md:mt-64">
        <SEO
          title="Mario's Writings"
          keywords={[`blog`, `gatsby`, `javascript`, `react`]}
        />
        <h1 class="text-4xl md:text-6xl ml-7 md:ml-25vw pt-8 font-heading mb-12">
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

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
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
