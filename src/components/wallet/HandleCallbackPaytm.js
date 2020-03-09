import React from 'react';
import {connect} from 'react-redux';

/*
  This Component is used handle the callback sent bu PayTM after user's transactions
*/

const HandleCallbackPaytm = (props)=>{
    const mny = props.match.params.mny;//mny - money
    let ucreds = props.profile.wallet;
    return(
        <div className="container white-text">
            <h4>You credited Rs. {mny}. You now have {ucreds} coins in your wallet</h4>
        </div>
    )
}

const mapStatetoProps = (state)=>{
    return{
        profile:state.firebase.profile
    }
}

export default connect(mapStatetoProps)(HandleCallbackPaytm);