import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { showSnackbar } from '../../store/Actions/UIActions'

export const ProtectedRoutes = ({ component: Component, ...rest }) => {
    const dispatch = useDispatch();
    const { auth } = useSelector(
        state => state.firebase
    )
    return (
        <Route 
            {...rest} render={
            (props) => {
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
