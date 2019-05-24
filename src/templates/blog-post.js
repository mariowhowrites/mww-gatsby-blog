import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = this.props.data.site.siteMetadata.title
    const { previous, next } = this.props.pageContext

    console.log(post)

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title={post.frontmatter.title}
          description={post.frontmatter.description || post.excerpt}
        />
        <article className="mt-20 px-6 md:px-0 md:w-1/2 mx-auto">
          {post.frontmatter.image && (
            <img
              className="mb-8 shadow-2xl rounded-lg"
              src={post.frontmatter.image}
              alt={post.frontmatter.title}
            />
          )}
          <h1 className="font-body font-bold text-3xl md:text-4xl mb-4">
            {post.frontmatter.title}
          </h1>
          <p className="opacity-50 font-bold text-2xl mb-8">
            {post.frontmatter.date}
          </p>
          <div
            id="post-content"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
          <hr />
          <ul className="flex flex-wrap justify-between p-0 py-8 text-xl font-semibold">
            <li>
              {previous && (
                <Link to={previous.fields.slug} rel="prev">
                  ← {previous.frontmatter.title}
                </Link>
              )}
            </li>
            <li>
              {next && (
                <Link to={next.fields.slug} rel="next">
                  {next.frontmatter.title} →
                </Link>
              )}
            </li>
          </ul>
        </article>
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        image
      }
    }
  }
`
