import React, { FC } from "react"
import { graphql } from "gatsby"

import { Layout } from "../components/layout"
import { SEO } from "../components/seo"
import { HeroSection } from "../components/hero-section"
import { SkillsSection } from "../components/skills-section"
import { RecentWriting } from "../components/recent-writing"
import { ContactMe } from "../components/contact-me"

interface HomePageProps {
  data: {
    allMarkdownRemark: {
      edges: ContentNode[]
    }
    allSkillsJson: {
      edges: SkillNode[]
    }
  }
}

export interface Content {
  timeToRead: number
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

export interface ContentNode {
  node: Content
}

export interface Skill {
  skill: string
  description: string
  color: string
}

export interface SkillNode {
  node: Skill
}

const HomePage: FC<HomePageProps> = function({ data }) {
  const posts = data.allMarkdownRemark.edges
  const skills = data.allSkillsJson.edges

  return (
    <Layout>
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
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { category: { eq: "Technical" } } }
      limit: 1
    ) {
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
