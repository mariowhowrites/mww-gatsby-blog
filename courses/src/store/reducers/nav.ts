import { ActionTypes } from "../actions"
import { NavAction } from "../actions/nav"
import { Chapter } from "../../types"

export interface NavState {
  currentChapter: Chapter
  newChapter: boolean
}

const nullChapter = {
  title: "null chapter",
  video: {
    file: {
      url: "sample url",
    },
  },
  chapterContent: {
    content: [
      {
        content: [
          {
            value: "html content here",
          },
        ],
      },
    ],
  },
}

export function navReducer(
  initialState: NavState = {
    currentChapter: nullChapter,
    newChapter: false,
  },
  action: NavAction
): NavState {
  switch (action.type) {
    case ActionTypes.chapterSelect:
      return {
        currentChapter: action.payload,
        newChapter: true,
      }
    case ActionTypes.chapterNav:
      return {
        currentChapter: initialState.currentChapter,
        newChapter: false,
      }
    default:
      return initialState
  }
}
