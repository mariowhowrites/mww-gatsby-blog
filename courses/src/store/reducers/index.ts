import { combineReducers } from 'redux'

import { coursesReducer } from './courses'
import { Course } from '../../types'
import { NavState, navReducer } from '../reducers/nav'

export interface StoreState {
  courses: Course[]
  nav: NavState
}

export const reducers = combineReducers<StoreState>({
  courses: coursesReducer,
  nav: navReducer
})
