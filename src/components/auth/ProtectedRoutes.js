import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { showSnackbar } from '../../store/actions/uiActions'

export const ProtectedRoutes = ({ component: Component, ...rest }) => {
    const dispacth = useDispatch();
    const { auth } = useSelector(
        state => state.firebase
    )
    return (
        <Route 
            {...rest} render={
            (props) => {
                if(auth.uid) return <Component {...props}/>
                else {
                    dispacth(showSnackbar({variant: 'info', message: "Sign-in to continue!"}))
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
