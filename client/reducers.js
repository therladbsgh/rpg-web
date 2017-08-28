/**
 * Root Reducer
 */
import { combineReducers } from 'redux';

// Import Reducers
import intl from './modules/Intl/IntlReducer';
import { sessionReducer } from 'redux-react-session';

// Combine all reducers into one root reducer
export default combineReducers({
  intl,
  session: sessionReducer,
});
