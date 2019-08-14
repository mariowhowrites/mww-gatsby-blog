import { ActionTypes } from '../actions'
import { Chapter } from '../../types'

export interface ChapterSelectAction {
  type: ActionTypes
  payload: Chapter
}

export type NavAction = ChapterSelectAction

export const chapterSelect = function(chapter: Chapter): ChapterSelectAction {
  return {
    type: ActionTypes.chapterSelect,
    payload: chapter
  }
}
