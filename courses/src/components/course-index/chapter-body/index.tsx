import React, { FC, useCallback, useState } from "react"

import { Chapter } from "../../../types"
import { StoreState } from "../../../store/reducers"
import { connect } from "react-redux"

interface ChapterBodyProps {
  chapter: Chapter
}

const _ChapterBody: FC<ChapterBodyProps> = function({
  chapter,
}: ChapterBodyProps) {
  console.log("in chapter body...")
  console.log(chapter)

  const content = chapter.chapterContent.content[0].content[0].value

  return (
    <article style={{ flex: "0 0 65%", paddingTop: "8%" }}>
      {chapter.video && <ChapterVideo chapter={chapter} />}
      <section
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "2.4rem",
        }}
      >
        <h2
          style={{
            alignSelf: "flex-start",
            marginLeft: "10%",
            marginBottom: "2.4rem",
            textTransform: "uppercase",
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
        >
          {chapter.title}
        </h2>
        <p style={{ width: "80%" }}>{content}</p>
      </section>
    </article>
  )
}

const mapStateToProps = function(state: StoreState) {
  return {
    chapter: state.nav.currentChapter,
  }
}

export const ChapterBody = connect(mapStateToProps)(_ChapterBody)

interface ChapterVideoProps {
  chapter: Chapter
}

const ChapterVideo: FC<ChapterVideoProps> = function({ chapter }) {
  const [containerWidth, setContainerWidth] = useState(640)

  let width = containerWidth * 0.8
  let height = width * 0.5625

  const widthRef = useCallback(function(node: any) {
    if (node !== null) {
      setContainerWidth(node.offsetWidth)
    }
  }, [])

  return (
    <section
      ref={widthRef}
      style={{ display: "flex", justifyContent: "center" }}
    >
      <video
        src={`https:${chapter.video.file.url}`}
        width={width}
        height={height}
        controls
      />
    </section>
  )
}
