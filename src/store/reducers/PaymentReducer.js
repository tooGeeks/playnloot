const initState = {}

const PaymentReducer = (state=initState,action)=>{
    switch(action.type){
        case 'CR_WALLET':
            alert("Crediting Wallet")
            console.log("Crediting Wallet");
            return state;
        case 'CR_WALLET_ERR':
            alert("Crediting Wallet Error")
            console.log("Crediting Wallet Error");
            return state;
        case 'MP_SUCCESS':
            console.log(" Payment Successful");
            alert("Payment Successful")
            return state;
        case 'MP_ERR':
            console.log("An error occured"+action.err,action.err);
            alert("An error occured")
            return state;
        default:
            return state;

    }
}

export default PaymentReducer;