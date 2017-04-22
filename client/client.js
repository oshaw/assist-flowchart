'use strict'
import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {createStore} from 'redux'
import reducer from './reducers/reducer'
import View from './components/view'

const store = createStore(reducer)

ReactDOM.render(
  <Provider store={store}>
    <View />
  </Provider>,
  document.getElementById('root')
)
