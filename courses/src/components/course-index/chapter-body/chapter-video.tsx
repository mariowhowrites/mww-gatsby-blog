import React, { useState, useCallback, FC } from "react"

import { Chapter } from "../../../types"

interface ChapterVideoProps {
  chapter: Chapter
  progress: number
  handleVideoProgress: (event: any) => void
}

export const ChapterVideo: FC<ChapterVideoProps> = function({
  chapter,
  progress,
  handleVideoProgress,
}) {
  const [containerWidth, setContainerWidth] = useState(640)
  const widthRef = useCallback(function(node: any) {
    if (node !== null) {
      setContainerWidth(node.offsetWidth)
    }
  }, [])
  let height = containerWidth * 0.5625

  return (
    <section
      ref={widthRef}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "80%",
      }}
    >
      <video
        src={`https:${chapter.video.file.url}`}
        onTimeUpdate={handleVideoProgress}
        width="100%"
        height={height}
        controls
      />
      <div
        style={{
          height: "2rem",
          backgroundColor: "#8DEA9C",
          content: "",
          alignSelf: "flex-start",
          width: `${progress}%`,
          transition: "width 0.4s",
        }}
      />
    </section>
  )
}
