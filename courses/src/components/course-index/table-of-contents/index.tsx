import React, { FC, CSSProperties } from "react"

import { Course, Chapter, Unit } from "../../../types"
import { connect } from "react-redux"
import { StoreState } from "../../../store/reducers"
import { chapterSelect, NavAction } from "../../../store/actions/nav"

interface TableOfContentsProps {
  course: Course
}

export const TableOfContents: FC<TableOfContentsProps> = function({
  course,
}: TableOfContentsProps) {
  return (
    <aside
      style={{
        flex: "0 0 35%",
        backgroundColor: "#63707B",
        color: "white",
        paddingLeft: "0.5rem",
        paddingTop: "8%",
        minHeight: "100vh",
      }}
    >
      <TocIndex units={course.units} />
    </aside>
  )
}

interface TocIndexProps {
  units: Unit[]
}

const TocIndex: FC<TocIndexProps> = function({ units }: TocIndexProps) {
  return (
    <div>
      {units.map((unit: Unit) => (
        <TocUnit key={unit.title} unit={unit} />
      ))}
    </div>
  )
}

interface TocUnitProps {
  unit: Unit
}

const TocUnit: FC<TocUnitProps> = function({ unit }) {
  return (
    <section
      key={unit.title}
      style={{ marginLeft: "2.5rem", marginBottom: "2.5rem" }}
    >
      <h3
        style={{
          marginTop: 0,
          marginBottom: "1.4rem",
          textTransform: "uppercase",
          fontSize: "1.2rem",
        }}
      >
        {unit.title}
      </h3>
      <ol style={{ listStyle: "none", padding: 0 }}>
        {unit.chapters.map((chapter: Chapter) => {
          return <TocChapter key={chapter.title} chapter={chapter} />
        })}
      </ol>
    </section>
  )
}

interface TocChapterProps {
  chapter: Chapter
  currentChapter: Chapter
  chapterSelect: (chapter: Chapter) => NavAction
}

const _TocChapter: FC<TocChapterProps> = function({
  chapter,
  currentChapter,
  chapterSelect,
}: TocChapterProps) {
  const isSelected = chapter === currentChapter

  const onChapterSelect = function() {
    chapterSelect(chapter)
  }

  const styleObject: CSSProperties = {
    opacity: 0.5,
    color: "white",
    textDecoration: "none",
  }

  if (isSelected) {
    styleObject.opacity = 1
    styleObject.fontWeight = "bold"
  }

  return (
    <li key={chapter.title} style={{ marginBottom: "1rem" }}>
      <a
        href="javascript:void(0)"
        onClick={onChapterSelect}
        style={styleObject}
      >
        {chapter.title}
      </a>
    </li>
  )
}

const mapStateToProps = function(state: StoreState) {
  return {
    currentChapter: state.nav.currentChapter,
  }
}

const TocChapter = connect(
  mapStateToProps,
  { chapterSelect }
)(_TocChapter)
