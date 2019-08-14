import React from "react"
import { Provider } from "react-redux"

import { CourseNode } from "./types"
import { store } from "./store"
import { CourseIndex } from "./components/course-index/index"
import { mockData } from "./mockData"
import "./index.css"


interface AppProps {
  courses?: CourseNode[]
}

export const CoursesApp: React.FC<AppProps> = ({ courses = [] }: AppProps) => {
  return (
    <Provider store={store}>
      <CourseIndex course={courses[0]} />
    </Provider>
  )
}
