'use strict'
import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {createStore} from 'redux'
import reducers from './reducers/reducers'
import View from './components/view'

const store = createStore(reducers)

ReactDOM.render(
  <View />,
  document.getElementById('root')
)
