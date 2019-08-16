import React, { FC, useEffect, useState } from "react"
import { connect } from "react-redux"
import { BLOCKS, MARKS } from "@contentful/rich-text-types"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"

import { Chapter } from "../../../types"
import { StoreState } from "../../../store/reducers"
import { chapterNav, NavAction } from "../../../store/actions/nav"
import { ChapterVideo } from "./chapter-video"

interface ChapterBodyProps {
  chapter: Chapter
  newChapter: boolean
  chapterNav: () => NavAction
}

const _ChapterBody: FC<ChapterBodyProps> = function({
  chapter,
  newChapter,
  chapterNav,
}: ChapterBodyProps) {
  const [progress, setProgress] = useState(3)
  useEffect(
    function() {
      if (newChapter) {
        setProgress(3)
        chapterNav()
      }
    },
    [newChapter]
  )

  const handleVideoProgress = function(event: any) {
    const { currentTime, duration } = event.target
    const currentProgress = (currentTime / duration) * 100

    if (currentProgress >= 0) {
      setProgress(Math.max(progress, currentProgress))
    }
  }

  const content = chapter.chapterContent.content

  return (
    <article style={{ flex: "0 0 65%", paddingTop: "8%" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {chapter.video && (
          <ChapterVideo
            handleVideoProgress={handleVideoProgress}
            progress={progress}
            chapter={chapter}
          />
        )}
        <section
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "2.4rem",
            width: "80%",
          }}
        >
          <h2
            style={{
              alignSelf: "flex-start",
              marginBottom: "2.4rem",
              textTransform: "uppercase",
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            {chapter.title}
          </h2>
          <div style={{ width: "100%" }}>
            {content.map(function(paragraph, index) {
              return (
                <p style={{ marginBottom: "1.5rem" }} key={index}>
                  {paragraph.content[0].value}
                </p>
              )
            })}
          </div>
        </section>
      </div>
    </article>
  )
}

const mapStateToProps = function(state: StoreState) {
  return {
    chapter: state.nav.currentChapter,
    newChapter: state.nav.newChapter,
  }
}

export const ChapterBody = connect(
  mapStateToProps,
  { chapterNav }
)(_ChapterBody)
