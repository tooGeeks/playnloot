import React from "react";
import {pushNotification} from '../../store/Actions/AuthActions'
import {connect} from 'react-redux';
import useForm from 'react-hook-form'
import { Container, TextField, Button, makeStyles } from "@material-ui/core";

/*
  This Component is used to Send Notifications to users! *UNDER MASSIVE CONSTRUCTION* 
  WARNING : DO NOT ASK ABOUT THIS
*/

const useStyles = makeStyles((theme)=>({
    button:{
        marginTop:theme.spacing(2)
    },
    textfield:{
        marginTop:theme.spacing(1)
    }
}))

const SendNotifications = (props)=>{
    const classes = useStyles();
    const {handleSubmit,errors, register} = useForm();
    const [data,sdata] = React.useState({title:"",body:"",clink:""})
    const hSubmit = (date,e)=>{
        e.preventDefault();
        console.log(data);
        return
        const {body,title} = data;
        if(title==="" || body===""){
            alert("Enter Complete Details!");
            return
        }
        props.pushNotification(data);
        
    }
    return(
        <React.Fragment>
            <Container>
            <form onSubmit={handleSubmit(hSubmit)}>
                <TextField
                    label="Notification Name"
                    id="title"
                    type="text"
                    className={classes.textfield}
                    name="title"
                    fullWidth
                />
                <TextField
                    label="Notification Body"
                    id="body"
                    type="text"
                    name="body"
                    className={classes.textfield}
                    fullWidth
                />
                <TextField
                    label="Link"
                    id="body"
                    type="text"
                    className={classes.textfield}
                    name="body"
                    fullWidth
                />
                <Button color="primary" className={classes.button} fullWidth variant="contained">Send</Button>
                </form>
            </Container>
        </React.Fragment>
    )
}

const mapDispatchtoProps = (dispatch)=>{
    return{
        pushNotification:(msg)=>dispatch(pushNotification(msg))
    }
}
export default connect(null,mapDispatchtoProps)(SendNotifications);