import authReducer from './authReducer'
import matchReducer from './matchReducer'
import paymentReducer from './paymentReducer'
import uiReducer from './uiReducer'
import {firestoreReducer} from 'redux-firestore'
import {firebaseReducer} from 'react-redux-firebase'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
    auth : authReducer,
    firebase : firebaseReducer,
    firestore : firestoreReducer,
    match : matchReducer,
    payment : paymentReducer,
    ui : uiReducer
})

export default rootReducer;