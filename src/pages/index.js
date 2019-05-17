import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import HeroSection from "../components/HeroSection"
import SkillsSection from "../components/SkillsSection"
import RecentWriting from "../components/RecentWriting"
import ContactMe from "../components/ContactMe"

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges
    const skills = data.allSkillsJson.edges

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title="All posts"
          keywords={[`blog`, `gatsby`, `javascript`, `react`]}
        />
        <HeroSection />
        <SkillsSection skills={skills} />
        <RecentWriting post={posts[0]} />
        <ContactMe />
      </Layout>
    )
  }
}

export default BlogIndex

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
          }
        }
      }
    }
    allSkillsJson {
      edges {
        node {
          skill
          description
          color
        }
      }
    }
  }
`
