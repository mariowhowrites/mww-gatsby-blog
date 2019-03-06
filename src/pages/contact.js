import React from "react"
import { graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import ContactForm from "../components/contact-form"

class BlogIndex extends React.Component {
  render() {
    const siteTitle = this.props.data.site.siteMetadata.title

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title="Contact Me"
          keywords={[`contact`, `freelance`, `development`, `javascript`]}
        />
        <Bio />
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
      }
    }
  }
`
