'use strict'
import {combineReducers} from 'redux'
import originAll from './origin/all'
import originResults from './origin/results'
import originSelected from './origin/selected'
import originQuery from './origin/query'

const reducer = combineReducers({
  all: originAll,
  results: originResults,
  selected: originSelected,
  query: originQuery
})

export default reducer
