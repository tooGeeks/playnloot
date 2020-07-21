import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

import firebase from './config/fbconfig'
import { createStore, compose, applyMiddleware } from 'redux';
import rootReducer from './store/reducers/rootReducer';
import thunk from 'redux-thunk'

import { getFirestore } from 'redux-firestore';
import { ReactReduxFirebaseProvider, getFirebase } from 'react-redux-firebase'
import { createFirestoreInstance, reduxFirestore } from 'redux-firestore' // <- needed if using firestore
import { Provider } from 'react-redux';

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

const rrfconfig = { 
  userProfile: 'Users',
  useFirestoreForProfile: true, 
  attachAuthIsReady: true
}

const store = createStore(rootReducer,
  compose(
    applyMiddleware(thunk.withExtraArgument({ getFirebase, getFirestore })),
    reduxFirestore(firebase) // redux bindings for firestore
  )  
);

const rrfprops = {
  firebase,
  config : rrfconfig,
  dispatch : store.dispatch,
  createFirestoreInstance
}


ReactDOM.render(<Provider store={store}><ReactReduxFirebaseProvider {...rrfprops}><App /></ReactReduxFirebaseProvider></Provider>, document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister({onSuccess,onUpdate});
