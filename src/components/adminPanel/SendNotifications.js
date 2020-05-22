import React from "react";
import {pushNotification} from '../../store/actions/authActions'
import {connect} from 'react-redux';
import Nav from './AdminNav'

/*
  This Component is used to Send Notifications to users! *UNDER MASSIVE CONSTRUCTION* 
  WARNING : DO NOT ASK ABOUT THIS
*/

const SendNotifications = (props)=>{
    const [data,sdata] = React.useState({title:"",body:"",clink:""})
    const handleChange= (e)=>{
        sdata({...data,[e.target.id]:e.target.value})
    }
    const handleSubmit = (e)=>{
        e.preventDefault();
        const {body,title} = data;
        if(title==="" || body===""){
            alert("Enter Complete Details!");
            return
        }
        props.pushNotification(data);
        
    }
    return(
        <React.Fragment>
        <Nav/>
            <div className='container'>
                <form onSubmit={handleSubmit}>
                    <label>Notification Name : </label>
                    <input className="white-text" type="text" id="title" onChange={handleChange}/><br/>
                    <label>Notification Body : </label>
                    <input className="white-text" type="text" id="body" onChange={handleChange}/><br/>
                    <label>Open Link : </label>
                    <div className="row">
                        <div className="col s5 m3">
                            <input className="white-text" type="text" defaultValue="playandloot.web.app/" disabled/>
                        </div>
                        <div className="col s6">
                            <input className="white-text" type="text" id="clink" onChange={handleChange}/><br/>
                        </div>
                    </div>
                    <button className="waves-effect waves-light btn hoverable">Send</button>
                </form>
            </div>
        </React.Fragment>
    )
}

const mapDispatchtoProps = (dispatch)=>{
    return{
        pushNotification:(msg)=>dispatch(pushNotification(msg))
    }
}
export default connect(null,mapDispatchtoProps)(SendNotifications);