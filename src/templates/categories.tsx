import React, { FC } from "react"
import { Link, graphql } from "gatsby"
import { Bio }from "./bio"
import {Layout} from "../components/layout"

interface CategoryPageTemplateProps {
  data: {
    allMarkdownRemark: {
      edges: CategoryPageContentNode[]
    }
  }
  pageContext: {
    category: string
  }
}

interface CategoryPageContentNode {
  node: {
    id: number
    excerpt: string
    html: string
    frontmatter: {
      title: string
      date: string
      description: string
    }
    fields: {
      slug: string
    }
  }
}

export const CategoryPageTemplate: FC<CategoryPageTemplateProps> = function({
  data,
  pageContext,
}) {
  const posts = data.allMarkdownRemark.edges
  const { category } = pageContext

  return (
    <Layout>
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

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

export default CategoryPageTemplate

export const pageQuery = graphql`
  query BlogPostsByCategory($category: String!) {
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
