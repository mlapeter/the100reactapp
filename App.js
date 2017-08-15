import React, {Component, PropTypes } from 'react';
import AppContainer from './app/containers/App/AppContainer'

import {createStore, applyMiddleware, combineReducers} from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import * as reducers from './app/redux'

const store = createStore(
  combineReducers(reducers),
  applyMiddleware(thunk)
)

export default function The100 (props) {
  return (
    <AppContainer />
  )
}
