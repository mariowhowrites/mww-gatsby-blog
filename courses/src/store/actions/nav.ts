import { ActionTypes } from "../actions"
import { Chapter } from "../../types"

export interface ChapterSelectAction {
  type: ActionTypes.chapterSelect
  payload: Chapter
}

export interface ChapterNavigationAction {
  type: ActionTypes.chapterNav
  payload: boolean
}

export type NavAction = ChapterSelectAction | ChapterNavigationAction

export const chapterSelect = function(chapter: Chapter): ChapterSelectAction {
  return {
    type: ActionTypes.chapterSelect,
    payload: chapter,
  }
}

export const chapterNav = function(): ChapterNavigationAction {
  return {
    type: ActionTypes.chapterNav,
    payload: false,
  }
}
