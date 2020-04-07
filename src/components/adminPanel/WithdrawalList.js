import React from 'react';
import WithdrawalDetails from './WithdrawalDetails'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import {confirmWithdrawal} from '../../Store/Actions/PaymentActions';
import Nav from './AdminNav'

const WithdrawalList = (props)=>{
    const handleClick = (reqid)=>{
        console.log(reqid);
        props.confirmWithdrawal(reqid);
    }
    const {wreq} = props;
    const reqs = wreq && wreq.map(usr=>{
        return(
            usr.requests.map(req=>{
                return(
                    <WithdrawalDetails hClick={handleClick} bttnname=" Confirm Payment" ukey={usr.id+"-"+usr.requests.indexOf(req)} key={usr.id+"-"+usr.requests.indexOf(req)}  details={{mno:usr.mno,fname:usr.fname,...req}}/>
                )
            })
        )
    })
    return(
        <React.Fragment>
            <Nav/>
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