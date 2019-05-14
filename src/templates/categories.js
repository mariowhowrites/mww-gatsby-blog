import React from "react"
import { Link, graphql } from "gatsby"
import Bio from "../components/bio"
import Layout from "../components/layout"

class CategoryPageTemplate extends React.Component {
  render() {
    const posts = this.props.data.allMarkdownRemark.edges
    const siteTitle = this.props.data.site.siteMetadata.title
    const { category } = this.props.pageContext

    console.log(posts)

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <h1>{capitalize(category)}</h1>
        <ul>
          {posts.map(({ node }) => (
            <li>
              <Link
                key={node.frontmatter.title}
                style={{ boxShadow: `none` }}
                to={node.fields.slug}
              >
                {node.frontmatter.title}
              </Link>
            </li>
          ))}
        </ul>
        <Bio />
      </Layout>
    )
  }
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

export default CategoryPageTemplate

export const pageQuery = graphql`
  query BlogPostsByCategory($category: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    allMarkdownRemark(
      filter: { frontmatter: { category: { eq: $category } } }
    ) {
      edges {
        node {
          id
          excerpt(pruneLength: 160)
          html
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            description
          }
          fields {
            slug
          }
        }
      }
    }
  }
`
