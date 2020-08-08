import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { showSnackbar, showDialog } from '../../store/actions/uiActions'
import { EnterUserDetails } from './SIgnInWithPhone'

export const ProtectedRoutes = ({ component: Component, ...rest }) => {
    const dispatch = useDispatch();
    const { auth, profile } = useSelector(
        state => state.firebase
    )
    return (
        <Route 
            {...rest} render={
            (props) => {
                if(auth.uid && profile && profile.isLoaded && !profile.isProfileComplete){
                    dispatch(showDialog({title:"Enter Details to Continue",content:<EnterUserDetails/>}));
                }
                if(auth.uid) return <Component {...props}/>
                else {
                    dispatch(showSnackbar({variant: 'info', message: "Login to continue!"}))
                    return <Redirect to={
                        {
                            pathname: '/signin',
                            state: {
                                from: props.location
                            }
                        }
                    }/>
                }
            }
        }/>
    )
}
