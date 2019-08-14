import { Course } from '../../types'
import { ActionTypes } from '../actions'
import { coursesReducer } from './courses'

describe('coursesReducer', function() {
  test('courseCreate', function() {
    const initialState = [
      {
        title: 'sample course',
        units: []
      }
    ]

    const newCourse = {
      title: 'newCourse',
      units: []
    }

    const newState = coursesReducer(initialState, {
      type: ActionTypes.courseCreate,
      payload: newCourse
    })

    expect(newState.length).toEqual(2)
  })
})
