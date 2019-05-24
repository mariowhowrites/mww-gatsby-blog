import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import ContactForm from "../components/contact-form"

class BlogIndex extends React.Component {
  render() {
    const { title, social } = this.props.data.site.siteMetadata

    return (
      <Layout location={this.props.location} title={title}>
        <SEO
          title="Contact Me"
          keywords={[`contact`, `freelance`, `development`, `javascript`]}
        />
        <section className="px-7 md:px-0 md:w-1/2 md:mx-auto">
          <h1
            className="font-heading text-4xl md:text-6xl"
            style={{ marginTop: "10vh", marginBottom: "4vh" }}
          >
            Contact Me
          </h1>
          <ul className="md:ml-7 font-semibold">
            <li className="text-4xl mb-4 trans-opacity hover:opacity-50">
              <a href={`https://twitter.com/${social.twitter}`}>
                Twitter <span className="text-teal-500 ml-1">&gt;</span>
              </a>
            </li>
            <li className="text-4xl mb-4 trans-opacity hover:opacity-50">
              <a href={`https://github.com/${social.github}`}>
                Github <span className="text-orange-500 ml-1">&gt;</span>
              </a>
            </li>
            <li className="text-4xl mb-4 trans-opacity hover:opacity-50">
              <a href={`https://medium.com/@${social.medium}`}>
                Medium <span className="text-red-600 ml-1">&gt;</span>
              </a>
            </li>
            <li className="text-4xl mb-4 trans-opacity hover:opacity-50">
              <a href={`https://dev.to/${social.devto}`}>
                Dev.to <span className="text-green-700 ml-1">&gt;</span>
              </a>
            </li>
            <li className="text-4xl mb-4 trans-opacity hover:opacity-50">
              <a href="https://docs.google.com/document/d/1Alx-1IwcP6ovn3jaK53fpUY7WeGZg2qLWUrKVT3D4m8/edit?usp=sharing">
                Résumé <span className="text-teal-500 ml-1">&gt;</span>
              </a>
            </li>
          </ul>
        </section>
        <ContactForm />
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
