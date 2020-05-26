const initState = {
    authErr:false
}

const authReducer = (state=initState,action)=>{
    switch(action.type){
        case 'LOGIN_SUCCESS':
            console.log('login success');
            return {
              ...state,
              authError: null,
            }

        case 'SIGNOUT_SUCCESS':
            console.log('signout success');
            return state;
        default:
            return state;
    }
    return state;
}

export default authReducer;