import { ActionTypes } from '../actions'
import { Course } from '../../types'

export interface CourseCreateAction {
  type: ActionTypes.courseCreate
  payload: Course
}

export type CourseAction = CourseCreateAction

export const courseCreate = function(course: Course): CourseCreateAction {
  return {
    type: ActionTypes.courseCreate,
    payload: course
  }
}
