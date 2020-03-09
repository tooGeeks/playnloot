import React from 'react';
//import {connect} from 'react-redux';
/*
  This Component is used to show if an error occurs during paytm transaction
*/

const HandleCallbackPaytmErr = (props)=>{
    return(
        <div className="container white-text">
            <h4 className="red-text">An Error Occured. Couldn't process your payment</h4>
        </div>
    )
}

export default HandleCallbackPaytmErr;