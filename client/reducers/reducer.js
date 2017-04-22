'use strict'
import {combineReducers} from 'redux'
import originAll from './origin/all'
import originResults from './origin/results'
import originSelected from './origin/selected'

const reducer = combineReducers({
  all: originAll,
  results: originResults,
  selected: originSelected
})

export default reducer
