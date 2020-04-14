import {isinDocs,findinMatches,isPlayerinMatch} from '../../Functions'
import 'firebase/functions'
import { isEmpty } from 'react-redux-firebase';

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
                players:{},
                plno:1,
                isActive : true,
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
            //dispatch({ type: 'SNACKBAR', variant: 'error', message: "An Error Occured\nTry Again!\n or Contact Admin"});
            dispatch({ type: 'SNACKBAR', variant: 'error', message: "Insufficient Coins! Please, buy required Coins and try again!"});
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
        const isAlRegM = isPlayerinMatch(players,cp);
        console.log("isAlRegM : "+isAlRegM+" isAlRegU : "+isAlRegU);
        let plno = match.plno;
        plno+=1;
        if(!isAlRegM && !isAlRegU){
            wallet-=2;
            cpmatches.push(mid);
            players[cp] = 0;
            db.collection('Matches').doc(mid).set({
                players:players,
                plno:plno
            },{merge:true}).then(()=>{
                db.collection('Users').doc(uid).set({matches:cpmatches,wallet},{merge:true})
                dispatch({ type: 'DIALOG_CLEAR' });
                dispatch({ type: 'SNACKBAR', variant: 'success', message: "Success! You`ve enrolled in the match. Happy Looting!"});
                dispatch({type:"EN_MATCH",mid,uid})
            })
        }else {
            dispatch({type:"EN_MATCH_ALR"})
            dispatch({ type: 'DIALOG_CLEAR' });
            dispatch({ type: 'SNACKBAR', variant: 'success', message: "Woaah! You`ve already Enrolled in this Match!"});
        }
        
    }
}

export const updateFacts = (players,mid)=>{
    return(dispatch,getState,{getFirebase,getFirestore})=>{
        for(let x in players){
            if(players[x].ukills===undefined) {
                alert("Please Fill The Details properly");
                return true;
            }
        }
        const db = getFirestore();
        ufacts(db,players).then((plist)=>{
            db.collection("Matches").doc(mid).get().then((doc)=>{
                if(!doc.exists) return;
                let mpl = doc.data().players;
                for(let pl in plist){
                    mpl[pl] = plist[pl]
                }
                db.collection("Matches").doc(mid).set({players:mpl},{merge:true}).then(()=>{
                    dispatch({type:'MTHF_UPD'})
                })
            })
        })
    }
}

const ufacts = (db,players)=>{
    return new Promise((resolve,reject)=>{
        let plist = {};
        players.map((pl)=>{
            plist[pl.pubgid] = pl.ukills
            db.collection("Users").doc(pl.id).set({
                kills:(pl.kills+pl.ukills),
                wallet:(pl.wallet)
            },{merge:true})
            return pl;
        })
        resolve(plist)
    })
}

export const cancelMatch = (mid)=>{
    return(dispatch,getState,{getFirebase,getFirestore})=>{
        const st = getState();
        const db = getFirestore();
        const matches = st.firestore.ordered.Matches;
        const match = matches ? findinMatches(matches,mid) : null;
        if(matches && !match.isActive){
            dispatch({type:"MTH_CAN_ERR",err:"Match Already Canceled"})
            return;
        }
        getPlayers(mid,st).then((players)=>{
            let batch = db.batch();
            if(isEmpty(players)) return;
            if(players.length<10){
                let i,batch = db.batch();
            for(i=0;i<players.length;i+=10){
                let nPlayers = players.splice(0,10)
                db.collection("Users").where('pubgid','in',nPlayers).get().then((snaps)=>{
                    snaps.forEach(snap => {
                        let wallet = snap.data().wallet;
                        wallet+=2;
                        let docRef = db.collection("Users").doc(snap.id)
                        batch.update(docRef,{wallet:wallet})
                    });
                }).then(()=>{
                    if(isEmpty(players)){
                        batch.commit().then(()=>{
                            db.collection('Matches').doc(mid).set({isActive:false},{merge:true}).then(()=>{
                                dispatch({type:"MTH_CAN_SUCC"})
                            })
                        })
                    }
                })
            }
            }else{
                db.collection("Users").where('pubgid','in',players).get().then((snaps)=>{
                    snaps.forEach(snap => {
                        console.log(snap.data());
                        let wallet = snap.data().wallet;
                        wallet+=2;
                        let docRef = db.collection("Users").doc(snap.id)
                        batch.update(docRef,{wallet:wallet})
                    });
                })
                batch.commit().then(()=>{
                    console.log('Done');
                })
            }
        })
    }
}

const getPlayers = (mid,st)=>{
    return new Promise((resolve,reject)=>{
        const matches = st.firestore.ordered.Matches;
        const match = matches ? findinMatches(matches,mid) : null;
        console.log(match)
        const players = match && match.players;
        let parr = []
        for(let x in players){
            parr.push(x)
        }
        resolve(parr)
    })
}

export const updateWinner = (winner)=>{
    return(dispatch,getState,{getFirebase,getFirestore})=>{
        const db = getFirestore()
        db.collection('Users').where('pubgid','==',winner.pubgid).get().then((snaps)=>{
            if(snaps.isEmpty) return
            let winnerSnap = snaps.docs[0];
            winner['id']=winnerSnap.id
            winner['kills']=winnerSnap.data().kills;
            winner['wallet'] =winnerSnap.data().wallet + (winner['ukills'] * winner.unit)
            db.collection("Users").doc(winner.id).set({
                kills:(winner.kills+winner.ukills),
                wallet:(winner.wallet)
            },{merge:true}).then(()=>{
                db.collection("Matches").doc(winner.mid).get().then((doc)=>{
                    if(!doc.exists) return;
                    let mpl = doc.data().players;
                    mpl[winner.pubgid] = winner.ukills
                    db.collection("Matches").doc(winner.mid).set({players:mpl,winner:winner.pubgid},{merge:true}).then(()=>{
                        dispatch({type:'MTHF_UPD'})
                    })
                })
            })
        })
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