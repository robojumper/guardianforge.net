import React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
import PostCard from "../components/PostCard"

export const pageQuery = graphql`
  {
    allWpPost(sort: { fields: [date], order: DESC }) {
      edges {
        node {
          id
          title
          slug
          excerpt
          uri
          author {
            node {
              name
              firstName
              lastName
              avatar {
                url
              }
            }
          }
          date(formatString: "MMMM DD, YYYY")
          status
          featuredImage {
            node {
              localFile {
                childImageSharp {
                  gatsbyImageData
                }
              }
            }
          }
        }
      }
    }
  }
`

type Props = {
  data: any
  pageContext: any
}

const BlogIndex = (props: Props) => {
  const {
    data,
    pageContext: { nextPagePath, previousPagePath },
  } = props


  const posts = data.allWpPost.edges.map(el => el.node)

  if (!posts.length) {
    return (
      <Layout>
        <Seo title="All posts" />
        <p>
          No blog posts found. Add posts to your WordPress site and they'll
          appear here!
        </p>
      </Layout>
    )
  }

  return (
    <Layout>
      <Seo title="All posts" />
      <ol style={{ listStyle: `none` }}>
        {posts.map(post => <PostCard post={post} key={post.uri} />)}
      </ol>
      {previousPagePath && (
        <>
          <Link to={previousPagePath}>Previous page</Link>
          <br />
        </>
      )}
      {nextPagePath && <Link to={nextPagePath}>Next page</Link>}
    </Layout>
  )
}

export default BlogIndex
