const initState = {
    matches:[]
}
const MatchReducer = (state=initState,action)=>{
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
        case 'EN_MATCH':
            console.log("Enrolled Successfully! Happy Looting");
            alert("Enrolled Successfully! Happy Looting");
            return state;
        case 'EN_MATCH_ERR':
            console.log("EM An Error Occured");
            alert("An Error Occured");
            return state;
        case 'EN_MATCH_ALR':
            console.log("Already Enrolled");
            alert("Already Enrolled");
            return state;
        default:
            return state;
    } 
}

export default MatchReducer;