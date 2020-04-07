import React from "react";
import { creditWallet } from '../../Store/Actions/PaymentActions';
import {connect} from 'react-redux';

/*
  This Component is used to add coins to user's wallet manually
*/

const ManualPayment = (props)=>{
    const [data,setd] = React.useState({noofcoins:0,pubgid:""})
    const handleChange = (e)=>{
        setd({...data,[e.target.id]:e.target.value})
        
    }
    const handleSubmit = (e)=>{
        e.preventDefault();
        if(parseInt(data.noofcoins)===0){
            alert("Amount must be greater than 0")
            return;
        }
        const p = window.confirm("Are You Sure?")
        if(p) props.creditWallet({noofcns:data.noofcoins,mode:"AdminPayment",pubgid:data.pubgid});
        
    }
return(
    <div className='container'>
        <form onSubmit={handleSubmit}>
            <label>PUBG ID :</label>
            <input type="text" id="pubgid"  className="white-text" name="pubgid" required onChange={handleChange}/><br/>
            <label>No. of Coins :</label>
            <input type="number" className="white-text" id="noofcoins" name="noofcoins" required onChange={handleChange}/><br/>
            <label>Amount :</label>
            <input type="number" className="white-text" id="amount" name="amount" value={(data.noofcoins)*5} disabled={true}/><br/>
            <button className="waves-effect waves-light btn">Credit</button>
        </form>
    </div>
)
}

const mapDispatchtoProps = (dispatch)=>{
    return{
        creditWallet:(data)=>{dispatch(creditWallet(data))}
    }
}

export default connect(null,mapDispatchtoProps)(ManualPayment);