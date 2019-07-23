import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import HeroSection from "../components/HeroSection"
import SkillsSection from "../components/SkillsSection"
import RecentWriting from "../components/RecentWriting"
import ContactMe from "../components/ContactMe"

function HomePage({ data }) {
  const siteTitle = data.site.siteMetadata.title
  const posts = data.allMarkdownRemark.edges
  const skills = data.allSkillsJson.edges

  return (
    <Layout title={siteTitle}>
      <SEO
        title="MarioWhoWrites"
        keywords={[`developer`, `gatsby`, `javascript`, `react`]}
      />
      <HeroSection />
      <SkillsSection skills={skills} />
      <RecentWriting post={posts[0]} />
      <ContactMe />
    </Layout>
  )
}

export default HomePage

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
