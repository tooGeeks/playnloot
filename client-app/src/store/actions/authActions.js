import { clearDialog } from "./uiActions";
import {reportError} from '../../Functions'

export const signIn = (credentials) => {
  return (dispatch, getState, {getFirebase}) => {
    const firebase = getFirebase();
    
    firebase.auth().signInWithEmailAndPassword(
      credentials.email,
      credentials.password
    ).then(() => {
      dispatch({type: 'BACKDROP_CLEAR'});
      dispatch({ type: 'LOGIN_SUCCESS' });
      dispatch({ type: 'SNACKBAR', variant: 'info', message: "Welcome!"});
    }).catch((err) => {
      console.log(err)
      dispatch({type: 'BACKDROP_CLEAR'});
      dispatch({ type: 'SNACKBAR', variant: 'error', message: err.message});
      dispatch({ type: 'LOGIN_ERROR', err });
    });
  }
}

export const signOut = () => {
  return (dispatch, getState, {getFirebase,getFirestore}) => {
    const firebase = getFirebase();
    const db = getFirestore();
    const {auth} = getState()
    const {uid} = auth
    firebase.auth().signOut().then(() => {
      dispatch({ type: 'SNACKBAR', variant: 'info', message: "Come back Soon! We`ll miss you!"});
      dispatch({ type: 'SIGNOUT_SUCCESS' })
    }).catch((err)=>{
      reportError(db,uid,{date:db.Timestamp.fromMillis(new Date().getTime()),...err}).then(()=>{
        
      })
    })
  }
}
 
export const signUp = (newUser) => {
  return (dispatch, getState, {getFirebase, getFirestore}) => {
    const firebase = getFirebase();
    const firestore = getFirestore();

    dispatch({type: 'BACKDROP'});

    firestore.collection('Users').where('pubgid', '==', newUser.pubgid).get().then(snapshot => {
      if(!snapshot.empty) {
        dispatch({type: 'BACKDROP_CLEAR'});
        dispatch({ type: 'SNACKBAR', variant: 'error', message: "This PUBG ID is already registered! Please check again or contact Admin!"});
      }
      else {
        firebase.auth().createUserWithEmailAndPassword(
          newUser.email, 
          newUser.password
        ).then(resp => {
          resp.user.updateProfile({displayName: newUser.pubgid}).then(() => {
            return firestore.collection('Users').doc(resp.user.uid).set({
              pubgid: newUser.pubgid,
              fname: newUser.firstName + " " + newUser.lastName,
              mno: parseInt(newUser.mno),
              wallet: 1,
              kills: 0,
              looted:0,
              isTrusted:false,
              hRating:0,
              matches: [],
              wins:0,
              //Del later :-
              firstName: newUser.firstName,
              lastName: newUser.lastName,
            }).then(()=>{
              firestore.collection("Orders").doc(resp.user.uid).set({orders:{}})
            })
          })
          
        }).then(() => {
          const user = firebase.auth().currentUser;
          user.sendEmailVerification().then(()=>{
            dispatch({type: 'BACKDROP_CLEAR'});
            dispatch({ type: 'SIGNUP_SUCCESS' });
            dispatch({ type: 'SNACKBAR', variant: 'success', message: "SignUp Successful! Happy Looting"});
          }).catch((err)=>{
            console.log(err);
            dispatch({type: 'BACKDROP_CLEAR'});
            dispatch({ type: 'SNACKBAR', variant: 'error', message: err.message});
            dispatch({ type: 'SIGNUP_ERROR', err});
          })
        }).catch((err) => {
          console.log(err);
          dispatch({type: 'BACKDROP_CLEAR'});
          dispatch({ type: 'SNACKBAR', variant: 'error', message: err.message});
          dispatch({ type: 'SIGNUP_ERROR', err});
        });
      }
    })
    
  }
}

export const signInWithPhone = (conOTP,userDetails)=>{
  return (dispatch, getState, {getFirebase,getFirestore}) => {
    const db = getFirestore();
    dispatch({type: 'BACKDROP'});
    db.collection('Users').where('pubgid', '==', userDetails.pubgid).get().then((snap)=>{
      if(!snap.empty){
        dispatch({type: 'BACKDROP_CLEAR'});
        dispatch({ type: 'SNACKBAR', variant: 'error', message: "This PUBG ID is already registered! Please check again or contact Admin!"});
      }else{
        conOTP.confirm(userDetails.otp).then((resp)=>{
          console.log(resp.user)
          return db.collection('Users').doc(resp.user.uid).get().then((snap)=>{
            if(!snap.empty){
              dispatch({type: 'BACKDROP_CLEAR'});
              dispatch({ type: 'LOGIN_SUCCESS' });
              dispatch({ type: 'SNACKBAR', variant: 'info', message: "Welcome!"});
              return;
            }else{
              resp.user.updateProfile({displayName:userDetails.pubgid}).then(()=>{
                return db.collection('Users').doc(resp.user.uid).set({
                  pubgid: userDetails.pubgid,
                  fname: userDetails.fname + " " + userDetails.lname,
                  mno: '+91 '+userDetails.phNo,
                  wallet: 1,
                  kills: 0,
                  looted:0,
                  matches: [],
                  isTrusted:false,
                  hRating:0,
                  wins:0,
                }).then(()=>{
                  db.collection("Orders").doc(resp.user.uid).set({orders:{}})
                })
              }).then(()=>{
                dispatch({type: 'BACKDROP_CLEAR'});
                dispatch({ type: 'SIGNUP_SUCCESS' });
                dispatch({ type: 'SNACKBAR', variant: 'success', message: "SignUp Successful! Happy Looting"});
              })
              dispatch(clearDialog())
            }
          })
        })
      }
    })
  }
}

export const resetPassword = (email)=>{
  return(dispatch,getState,{getFirebase,getFirestore})=>{
      const fb = getFirebase();
      const st = getState();
      const db = getFirestore()
      const {auth} = st
      const {uid} = auth
      // console.log(st);
      fb.auth().sendPasswordResetEmail(email).then(()=>{
          dispatch({type:"PWD_RST"})
          dispatch(clearDialog())
          dispatch({ type: 'SNACKBAR', variant: 'success', message: "Check ur Email: We sent you a reset passwaord link!" });
      }).catch((err)=>{
          reportError(db,uid,{date:db.Timestamp.fromMillis(new Date().getTime()),...err}).then(()=>{
            dispatch({type:"PWD_RST_ERR",err})
            dispatch(clearDialog());
            dispatch({ type: 'SNACKBAR', variant: 'error', message: `Something went wrong! Don\`t worry just contact Admin (${err})` });
          })
      })
  }
}

export const pushNotification = (msg)=>{
  return(dispatch,getState,{getFirebase,getFirestore})=>{
      console.log(msg);
      const fb = getFirebase();
      let f = fb.functions().httpsCallable('pushNotification');
      f({msg}).then((resp)=>{
          console.log("Sent",resp);
      }).catch((err)=>{
          console.log(err);
          
      })
      dispatch({type:"NEW_NOT"})
  }
}