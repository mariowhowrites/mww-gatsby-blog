import { Course } from '../../types'
import { ActionTypes, CourseAction } from '../actions'

export function coursesReducer(
  state: Course[] = [],
  action: CourseAction
): Course[] {
  switch (action.type) {
    case ActionTypes.courseCreate:
      return [...state, action.payload]
    default:
      return state
  }
}
