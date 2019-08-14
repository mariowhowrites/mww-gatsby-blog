import React, { FC } from "react"
import { connect } from "react-redux"

import { Chapter, CourseNode } from "../../types"
import { StoreState } from "../../store/reducers"
import { TableOfContents } from "./table-of-contents"
import { ChapterBody } from "./chapter-body"
import { chapterSelect, NavAction } from "../../store/actions/nav"

type CourseIndexProps = {
  course: CourseNode
  currentChapter?: Chapter
  chapterSelect?: (chapter: Chapter) => NavAction
}

export const _CourseIndex: FC<CourseIndexProps> = function({
  course: courseNode,
  currentChapter,
  chapterSelect,
}: CourseIndexProps) {
  const course = courseNode.node

  if (currentChapter.title === "null chapter") {
    if (chapterSelect) {
      chapterSelect(course.units[0].chapters[0])
    }
  }

  return (
    <main style={{ display: "flex", fontFamily: '"Roboto", sans-serif' }}>
      <ChapterBody />
      <TableOfContents course={course} />
    </main>
  )
}

const mapStateToProps = function(state: StoreState) {
  return {
    currentChapter: state.nav.currentChapter,
  }
}

export const CourseIndex = connect(
  mapStateToProps,
  { chapterSelect }
)(_CourseIndex)
