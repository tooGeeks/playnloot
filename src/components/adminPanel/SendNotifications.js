import React from "react";
import {sendNewNot} from '../../Store/Actions/MatchActions'
import {connect} from 'react-redux';

/*
  This Component is used to Send Notifications to users! *UNDER MASSIVE CONSTRUCTION* 
  WARNING : DO NOT ASK ABOUT THIS
*/

const SendNotifications = (props)=>{
    const [data,sdata] = React.useState({})
    const handleChange= (e)=>{
        sdata({...data,[e.target.id]:e.target.value})
    }
    const handleSubmit = (e)=>{
        e.preventDefault();
        props.sendNewNot(data);
        
    }
    return(
        <div className='container black'>
            <form onSubmit={handleSubmit}>
                <label>Notification Name : </label>
                <input className="white-text" type="text" id="title" onChange={handleChange}/><br/>
                <label>Notification Body : </label>
                <input className="white-text" type="text" id="body" onChange={handleChange}/><br/>
                <button className="waves-effect waves-light btn hoverable">Send</button>
            </form>
        </div>
    )
}

const mapDispatchtoProps = (dispatch)=>{
    return{
        sendNewNot:(msg)=>dispatch(sendNewNot(msg))
    }
}
export default connect(null,mapDispatchtoProps)(SendNotifications);