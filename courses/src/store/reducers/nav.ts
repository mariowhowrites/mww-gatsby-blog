import { ActionTypes } from "../actions"
import { NavAction } from "../actions/nav"
import { Chapter } from "../../types"

export interface NavState {
  currentChapter: Chapter
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
  },
  action: NavAction
): NavState {
  switch (action.type) {
    case ActionTypes.chapterSelect:
      return {
        currentChapter: action.payload,
      }
    default:
      return initialState
  }
}
