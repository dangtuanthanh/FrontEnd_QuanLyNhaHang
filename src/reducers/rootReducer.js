// rootReducer.js

import { combineReducers } from 'redux';
import loadingReducer from './loadingReducer';

const rootReducer = combineReducers({
  loading: loadingReducer
})

export default rootReducer;