import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

const WithdrawalDetails = (props)=>{
    const {details,bttnname,hClick,ukey,columns,colValues} = props
    const {fname,pmode,coins,isComplete,mno,reqdate} = details;
    const reqdiv = columns ? columns.map(col=>{
        if(col==='rs') return <Fragment key={col}><span>{colValues[col]} : {details['coins']*5}</span><br/></Fragment>
        return(
            <Fragment key={col}><span>{colValues[col]} : {details[col]}</span><br/></Fragment>
        )
    }) : <div>
        <span className='card-title'>By {fname}</span><br/>
                        <span>Made on : {moment(reqdate.toDate()).calendar()}</span><br/>
                        <span>Coins : {coins}</span><br/>
                        <span>Rs. : {coins*5}</span><br/>
                        <span>WhatsApp No. : {mno}</span><br/>
                        <span>Payment Mode : {pmode}</span><br/>
    </div>
    const status = isComplete ? <span className='green-text'>Status : Paid</span> : <span className='red-text'>Status : Pending</span>
    return(
        <React.Fragment>
            <div className='row'>
                <div className='col col s12 m6 offset-m3'>
                    <div className='card black'>
                        <div className='card-content white-text'>
                            {reqdiv}
                            {status}
                        </div>
                        <div hidden={!bttnname || isComplete} className="card-action">
                        <Link className="white-text" to={window.location.pathname} onClick={()=>{hClick(ukey)}} ><button className="waves-effect waves-light btn-small">{bttnname}</button></Link>
                    </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default WithdrawalDetails