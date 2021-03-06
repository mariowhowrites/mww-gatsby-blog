/**
 * Bio component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React, { FC, CSSProperties } from "react"
import { StaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"

export const Bio: FC = function() {
  const wrapperStyles: CSSProperties = {
    display: "flex",
  }

  return (
    <StaticQuery
      query={bioQuery}
      render={data => {
        const { author, social } = data.site.siteMetadata
        return (
          <div style={wrapperStyles}>
            <Image
              fixed={data.avatar.childImageSharp.fixed}
              alt={author}
              imgStyle={{
                borderRadius: `50%`,
              }}
            />
            <p>
              {author}'s personal blog. Intrigued by tech and creative
              expression.
              {` `}
              <a href={`https://twitter.com/${social.twitter}`}>Twitter</a>
              {` `}|{` `}
              <a href={`https://github.com/${social.github}`}>GitHub</a>
              {` `}|{` `}
              <a href={`https://medium.com/@${social.medium}`}>Medium</a>
              {` `}|{` `}
              <a href={`https://dev.to/${social.devto}`}>Dev.to</a>
              {` `}|{` `}
              <a
                href={`https://docs.google.com/document/d/1Alx-1IwcP6ovn3jaK53fpUY7WeGZg2qLWUrKVT3D4m8/edit?usp=sharing`}
              >
                Resume
              </a>
              {` `}|{` `}
              <a href={`/contact`}>Contact</a>
              {` `}
            </p>
          </div>
        )
      }}
    />
  )
}

const bioQuery = graphql`
  query BioQuery {
    avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
      childImageSharp {
        fixed(width: 50, height: 50) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
        author
        social {
          twitter
          github
          medium
          devto
        }
      }
    }
  }
`
