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
  return (dispatch, getState, {getFirebase}) => {
    const firebase = getFirebase();

    firebase.auth().signOut().then(() => {
      dispatch({ type: 'SNACKBAR', variant: 'info', message: "Come back Soon! We`ll miss you!"});
      dispatch({ type: 'SIGNOUT_SUCCESS' })
    });
  }
}
 
export const signUp = (newUser) => {
  return (dispatch, getState, {getFirebase, getFirestore}) => {
    const firebase = getFirebase();
    const firestore = firebase.firestore();

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
              orders: [],
              matches: [],
              //Del later :-
              firstName: newUser.firstName,
              lastName: newUser.lastName,
            });
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

export const resetPassword = ()=>{
  return(dispatch,getState,{getFirebase,getFirestore})=>{
      const fb = getFirebase();
      const st = getState();
      fb.auth().sendPasswordResetEmail(st.firebase.auth.email).then(()=>{
          dispatch({type:"PWD_RST"})
      }).catch((err)=>{
          dispatch({type:"PWD_RST_ERR",err})
      })
  }
}