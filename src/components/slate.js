import React from 'react';
import {connect} from 'react-redux';
import { creditWallet } from '../../store/actions/PaymentActions';
import { Helmet } from 'react-helmet';
const Wallet = (props)=>{
    const [coins,setCoins] = React.useState({coins:0});
    const handleChange = (e)=>{
        setCoins({coins:e.target.value})
    }
    const handleSubmit = (e)=>{
        e.preventDefault();
        props.creditWallet(coins.coins)
    }
    return(
        <React.Fragment>
            <Helmet>
                <title>Wallet!</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css"/>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
            </Helmet>
            <div className="container white-text">
                <h4>Please Enter No. of Coins. Each coin costs Rs. 5</h4>
                <form onSubmit={handleSubmit}>
                    <label ><b>No of Coins:</b></label>
                    <input className="white-text" type="Number" min="1" id="coins" name="coins" onChange={handleChange} width="3"/><br/>
                    {/* Field to calculate and show amount in Rs. */}<input type="text" className="white-text"  value={"Rs. "+(coins.coins)*5} disabled={true}/><br/>
                    <button id="crnmbttn" disabled={coins.coins<1} className="waves-effect waves-light btn hoverable">Credit Wallet</button>
                </form>
            </div>
        </React.Fragment>
    )
}

const mapDispatchtoProps = (dispatch)=>{
    return{
        creditWallet:(noofcoins)=>dispatch(creditWallet(noofcoins))//Imported from PaymentActions
    }
}

export default connect(null,mapDispatchtoProps)(Wallet);
