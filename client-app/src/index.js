import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import firebase from './config/fbConfig';
//import 'firebase/auth'
//import 'firebase/firestore' // <- needed if using firestore

// import 'firebase/functions' // <- needed if using httpsCallable
import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from './store/reducers/rootReducer'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

import { getFirestore } from 'redux-firestore';
import { ReactReduxFirebaseProvider, getFirebase } from 'react-redux-firebase'
import { createFirestoreInstance, reduxFirestore } from 'redux-firestore' // <- needed if using firestore


const rrfConfig = { 
  userProfile: 'Users',
  useFirestoreForProfile: true, 
  attachAuthIsReady: true
}

const onUpdate = (reg)=>{
  console.log("Service Worker UPD Working",reg);
  reg.update().then((upx)=>{
    console.log("Service Worker Updated.",upx)
    window.location.reload(true);
  })
}

const onSuccess = (reg)=>{
  console.log("Service Worker Updated",reg);
  alert("Service Worker Updated, Yeahhhh!");
}

//firebase.initializeApp(fbConfig);
// Initialize other services on firebase instance
// firebase.firestore() // <- needed if using firestore
// firebase.functions() // <- needed if using httpsCallable

const store = createStore(rootReducer,
    compose(
      applyMiddleware(thunk.withExtraArgument({ getFirebase, getFirestore })),
      reduxFirestore(firebase) // redux bindings for firestore
    )  
);

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance
}


ReactDOM.render(<Provider store={store}><ReactReduxFirebaseProvider {...rrfProps}><App /></ReactReduxFirebaseProvider></Provider>, document.getElementById('root'));
serviceWorker.register({onUpdate,onSuccess})