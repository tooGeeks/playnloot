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

export const enterMatch = (match,userData)=>{
    return(dispatch,getState,{getFirebase,getFirestore}) => {
        const st = getState();
        const {profile, auth} = st.firebase;
        let wallet = profile.wallet;
        if(wallet<2){
            dispatch({type:"EN_MATCH_ERR"})
            //dispatch({ type: 'SNACKBAR', variant: 'error', message: "An Error Occured\nTry Again!\n or Contact Admin"});
            dispatch({ type: 'SNACKBAR', variant: 'error', message: "Insufficient Coins! Please, buy required Coins and try again!"});
            return;
        }
        if(match.plno>=100){
            dispatch({type:"EN_MATCH_ERR"})
            dispatch({ type: 'SNACKBAR', variant: 'error', message: "Match is Full!"});
            return
        }
        const cp = profile.pubgid;
        const db = getFirestore();
        switch(match.mode){
            case "Solo":
                let cpmatches = st.firebase.profile.matches;
                const isAlRegU = isinDocs(cpmatches,match.id);
                let players = match.players;
                const isAlRegM = isPlayerinMatch(players,cp);
                console.log("isAlRegM : "+isAlRegM+" isAlRegU : "+isAlRegU);
                let plno = match.plno;
                plno+=1;
                if(!isAlRegM && !isAlRegU){
                    wallet-=2;
                    cpmatches.push(match.id);
                    players[cp] = 0;
                    db.collection('Matches').doc(match.id).set({
                        players:players,
                        plno:plno
                    },{merge:true}).then(()=>{
                        db.collection('Users').doc(auth.uid).set({matches:cpmatches,wallet},{merge:true})
                            dispatch({ type: 'SNACKBAR', variant: 'success', message: "Success! You`ve enrolled in the match. Happy Looting!"});
                            dispatch({type:"EN_MATCH",cp,'mid':match.id})
                    })
                }else {
                    dispatch({type:"EN_MATCH_ALR"})
                    dispatch({ type: 'SNACKBAR', variant: 'success', message: "Woaah! You`ve already Enrolled in this Match!"});
                }
                break;
            case "Duo":
                //let parr = [userData.mate1]
                const {mate1} = userData
                if(wallet<4){
                    dispatch({ type: 'SNACKBAR', variant: 'error', message: "Insufficient Coins! Please, buy required Coins and try again!"});
                    return;
                }
                db.collection("Users").where('pubgid','==',mate1).get().then(snaps=>{
                    if(snaps.empty) {
                        dispatch({ type: 'SNACKBAR', variant: 'error', message: "Your friend wasn't found. Check Your Mate's PUBGID!"});
                        return;
                    }
                    let players = match.players;
                    let profile2 = snaps.docs[0].data()
                    let cp2 = mate1
                    let cp1matches = st.firebase.profile.matches;
                    let cp2matches = profile2.matches;
                    let parr = [cp,mate1]
                    const isAlRegU1 = isinDocs(cp1matches,match.id);
                    const isAlRegM1 = isPlayerinMatch(players,cp,"Duo");
                    const isAlRegU2 = isinDocs(cp2matches,match.id);
                    const isAlRegM2 = isPlayerinMatch(players,cp2,"Duo");
                    console.log("U1 : "+isAlRegU1+" M1 : "+isAlRegM1+" U2 : "+isAlRegU2+" M2 : "+isAlRegM2)
                    if(!isAlRegM1 && !isAlRegU1 && !isAlRegM2 && !isAlRegU2){
                        cp1matches.push(match.id)
                        cp2matches.push(match.id)
                        players[cp] = {[cp]:0,[mate1]:0}
                        let plno = parseInt(match.plno)+2
                        wallet -= 4
                        db.collection("Matches").doc(match.id).set({players,plno},{merge:true}).then(()=>{
                            db.collection("Users").where('pubgid','in',parr).get().then((snaps)=>{
                                snaps.docs.forEach(doc=>{
                                    if(doc.data().pubgid===cp)
                                        db.collection("Users").doc(doc.id).set({wallet,matches:cp1matches},{merge:true})
                                    else
                                        db.collection("Users").doc(doc.id).set({matches:cp2matches},{merge:true})
                                        dispatch({ type: 'SNACKBAR', variant: 'success', message: "Success! You`ve enrolled in the match. Happy Looting!"})
                                })
                            })
                        })
                        
                    }else{
                        if(isAlRegM1 && isAlRegU1 && isAlRegM2 && isAlRegU2){
                            dispatch({ type: 'SNACKBAR', variant: 'success', message: "Woaah! You`ve already Enrolled in this Match with your friend!"});
                            return;
                        }
                        if(isAlRegM1 && isAlRegU1){
                            dispatch({ type: 'SNACKBAR', variant: 'error', message: "You've already enrolled in this match!"});
                            
                        }
                        if(isAlRegM2 && isAlRegU2){
                            dispatch({ type: 'SNACKBAR', variant: 'error', message: "Your friend has already enrolled in this match!"});
                            return;
                        }
                    }
                })
                console.log("Duo",userData)
                break;
            case "Squad":
                console.log("Squad")
                break;
            default:
                break;
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