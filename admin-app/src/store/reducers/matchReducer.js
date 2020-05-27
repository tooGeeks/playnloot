const initState = {
    matches:[]
}

const matchReducer = (state=initState,action)=>{
    switch(action.type){
        case 'CR_MATCH':
            alert("Match Created")
            console.log("Match Created",action.match);
            return state;
        case 'CR_MATCH_ERR':
            alert("An Error Occured while creating match : ",action.err)
            console.error("An Error Occured while creating match : ",action.err);
            break;
        case 'UD_MATCH':
            alert("Match Updated")
            console.log("Match Updated");
            return state;
        case 'MTHF_UPDW':
            console.log("Winner Updated")
            alert("Winner Updated")
            return state;
        case 'MTHF_UPDWE':
            console.log("Error : ",action.err)
            alert("Error : "+action.err)
            return state;
        case "MTH_CAN_SUCC":
            console.log("Match Cancelled Successfully")
            alert("Match Cancelled Successfully")
            return state
        default:
                return state;
    }
}

export default matchReducer
