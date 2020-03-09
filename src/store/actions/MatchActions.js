import {isinDocs} from '../../Functions'
import 'firebase/functions'


/*
  This File Contains All Match Actions such as Create Match, Update Match, Enter Match, etc. 
*/

export const createMatch = (match)=>{
    return (dispatch,getState,{getFirebase,getFirestore})=>{
        //Async Code
        const db = getFirestore();
        db.collection('Matches').get().then((snap)=>{
            const size = snap.size;
            let mname ="MTH" +(2000 + parseInt(size)+1)
            db.collection("Matches").doc(mname).set({
                ...match,
                players:[],
                plno:0,
                createdAt : new Date()
            }).then(()=>{
                dispatch({type:"CR_MATCH",match});
            }).catch((err)=>{
                //console.error("AN Error Occured : ",err);
                dispatch({type:"CR_MATCH_ERR",err});
            })
        })
    }
}

export const updateMatch = (mid,match)=>{
    return(dispatch,getState,{getFirebase,getFirestore})=>{
        const db = getFirestore();
        console.log("MID : "+mid+" Match : ",match);
        db.collection("Matches").doc(mid).set({...match},{merge:true}).then(()=>{
            dispatch({type:"UD_MATCH"});
        })
    }
}

export const enterMatch = (mid,uid)=>{
    return(dispatch,getState,{getFirebase,getFirestore}) => {
        const st = getState();
        const {profile} = st.firebase;
        let wallet = profile.wallet;
        if(wallet<2){
            dispatch({type:"EN_MATCH_ERR"})
            return;
        }
        const cp = st.firebase.profile.pubgid;
        const db = getFirestore();
        const matches = st.firestore.ordered.Matches;
        const match = matches ? matches.find((match)=>{
            return(match.id===mid)
        }) : null;
        let cpmatches = st.firebase.profile.matches;
        const isAlRegU = isinDocs(cpmatches,mid);
        let players = match.players;
        const isAlRegM = isinDocs(players,cp);
        console.log("isAlRegM : "+isAlRegM+" isAlRegU : "+isAlRegU);
        let plno = match.plno;
        plno+=1;
        if(!isAlRegM && !isAlRegU){
            wallet-=2;
            cpmatches.push(mid);
            players.push(cp);
            db.collection('Matches').doc(mid).set({
                players:players,
                plno:plno
            },{merge:true}).then(()=>{
                db.collection('Users').doc(uid).set({matches:cpmatches,wallet},{merge:true})
                dispatch({type:"EN_MATCH",mid,uid})
            })
        }else dispatch({type:"EN_MATCH_ALR"})
        
    }
}

export const sendNewNot = (msg)=>{
    return(dispatch,getState,{getFirebase,getFirestore})=>{
        console.log(msg);
        const fb = getFirebase();
        let f = fb.functions().httpsCallable('newNotification');
        f({msg}).then(()=>{
            console.log("Sent");
            
        }).catch((err)=>{
            console.log(err);
            
        })
        dispatch({type:"NEW_NOT"})
    }
}