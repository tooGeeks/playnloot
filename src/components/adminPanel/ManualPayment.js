import React from "react";
import { manualPayment } from '../../store/actions/PaymentActions';
import {connect} from 'react-redux';
import Nav from './AdminNav'

/*
  This Component is used to add coins to user's wallet manually
*/

const ManualPayment = (props)=>{
    const [data,setd] = React.useState({amount:0})
    const handleChange = (e)=>{
        setd({...data,[e.target.id]:e.target.value})
    }
    const handleSubmit = (e)=>{
        e.preventDefault();
        if(parseInt(data.amount)===0){
            alert("Amount must be greater than 0")
            return;
        }
        if((data.amount)%5!==0){
            alert("Amount must be a multiple of 5")
            return;
        }
        const p = window.confirm("Are You Sure?")
        if(p) props.manualPayment(data);
        
    }
return(
    <React.Fragment>
        <Nav/>
        <div className='container'>
        <form onSubmit={handleSubmit}>
            <label>PUBG ID :</label>
            <input type="text" id="pubgid"  className="white-text" name="pubgid" required onChange={handleChange}/><br/>
            <label>Amount :</label>
            <input type="number" className="white-text" id="amount" name="amount" required onChange={handleChange}/><br/>
            <label>Coins :</label>
            <input type="number" className="white-text" id="noofcns" name="noofcns" value={(data.amount)/5} disabled={true}/><br/>
            <button className="waves-effect waves-light btn">Credit</button>
            </form>
        </div>
    </React.Fragment>
)
}

const mapDispatchtoProps = (dispatch)=>{
    return{
        manualPayment:(data)=>{dispatch(manualPayment(data))}
    }
}

export default connect(null,mapDispatchtoProps)(ManualPayment);