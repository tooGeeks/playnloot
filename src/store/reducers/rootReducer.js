import authReducer from './authReducer'
import projectReducer from './projectReducer'
import { combineReducers } from 'redux'
import { firestoreReducer } from 'redux-firestore';
import { firebaseReducer } from 'react-redux-firebase'
import  uiReducer  from './uiReducer'
import MatchReducer from './MatchReducer'
import PaymentReducer from './PaymentReducer'

const rootReducer = combineReducers({
  auth: authReducer,
  project: projectReducer,
  firestore: firestoreReducer,
  firebase: firebaseReducer,
  ui: uiReducer,
  Match : MatchReducer,
  PaymentReducer : PaymentReducer,
});

export default rootReducer