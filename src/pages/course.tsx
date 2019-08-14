import React from "react"
import { graphql } from "gatsby"
import { CoursesApp } from "../../courses/src/CoursesApp"

interface CoursesIndexProps {
  data: {
    allContentfulCourse: {
      edges: CourseNode[]
    }
  }
}

interface CourseNode {
  node: {
    title: string
    units: {
      title: string
      chapters: {
        title: string
        video: {
          file: {
            url: string
          }
        }
      }
    }
  }
}

interface UnitNode {
  title: string
  chapters: ChapterNode[]
}

interface ChapterNode {
  node: {
    title: string
    video: {
      file: {
        url: string
      }
    }
  }
}

const CoursesIndex: React.FC<CoursesIndexProps> = function({ data }) {
  const courses = data.allContentfulCourse.edges

  return (
    // <div>
    //   <h2>Courses!</h2>
    //   {courses.map(function(course) {
    //     return <p key={course.node.title}>{course.node.title}</p>
    //   })}

    //   <video
    //     controls
    //     style={{ width: "80%" }}
    //     src={`https:${chapter.node.video.file.url}`}
    //   />
    // </div>
    <CoursesApp courses={courses} />
  )
}

export default CoursesIndex

export const pageQuery = graphql`
  {
    allContentfulCourse {
      edges {
        node {
          title
          units {
            title
            chapters {
              title
              chapterContent {
                content {
                  content {
                    value
                  }
                }
              }
              video {
                file {
                  url
                }
              }
            }
          }
        }
      }
    }
  }
`
