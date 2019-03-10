import {applyMiddleware, compose, createStore} from 'redux';
import {createLogger} from 'redux-logger'
import {rootReducer} from '../reducers';
import thunk from 'redux-thunk';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk, createLogger())));