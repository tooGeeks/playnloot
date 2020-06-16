import React from 'react';
import WithdrawalDetails from './WithdrawalDetails'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import {confirmWithdrawal} from '../../store/Actions/PaymentActions';

const WithdrawalList = (props)=>{
    const handleClick = (reqid)=>{
        console.log(reqid);
        props.confirmWithdrawal(reqid);
    }
    const {wreq} = props;
    console.log(wreq)
    const reqs = wreq && wreq.map(req=>{
        return(
            <WithdrawalDetails hClick={handleClick} bttnname=" Confirm Payment" details={{mno:req.mno,fname:req.pubgid,...req}}/>
        )
    })
    return(
        <React.Fragment>
            <div className='container white-text'>
                {reqs}
            </div>
        </React.Fragment>
    )
}

const mapStatetoProps = (state)=>{
    return{
        wreq:state.firestore.ordered.WithdrawalRequests
    }
}

const mapDispatchtoProps = (dispatch)=>{
    return{
        confirmWithdrawal:(reqid)=>dispatch(confirmWithdrawal(reqid))
    }
}

export default compose(
    connect(mapStatetoProps,mapDispatchtoProps),
    firestoreConnect([
        {collection:'WithdrawalRequests'}
    ])
)(WithdrawalList)