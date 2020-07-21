import {isinDocs,findinMatches,isPlayerinMatch, arePlayersinMatch, deductCoins} from '../../Functions'
import 'firebase/functions'
import { isEmpty } from 'react-redux-firebase';

/*
  This File Contains All Match Actions such as Create Match, Update Match, Enter Match, etc. 
*/

export const createMatch = (rmatch,totalExp,paid)=>{
    return (dispatch,getState,{getFirebase,getFirestore})=>{
        //Async Code
        const {auth , profile } = getState().firebase;
        if(!paid){
            deductCoins(getFirestore(),totalExp.tenpc,auth.uid);
        }
        const match = {...rmatch}
        const taglist = match.tags ? match.deftag+","+match.tags : match.deftag;
        delete match['tags']
        delete match['deftag']
        let mode = {}
        /**
        let modep = ['team','view','map']
        modep.forEach((x)=>{
            mode[x] = match[x]
            delete match[x]
        }) 
        match['mode'] = mode*/
        match['tags'] = taglist.split(',')
        match['fee'] = parseInt(match['fee'])
        match['bKills'] = parseInt(match['bKills'])
        match['host'] = profile.pubgid;
        match['isTrusted'] = profile.isTrusted;
        match['hRating'] = profile.hRating;
        let md = new Date(match.mdate)
        let ld = new Date(match.lrdate);
        md.setHours(match.mtime.split(':')[0])
        md.setMinutes(match.mtime.split(':')[1])
        delete match['mdate']
        delete match['mtime']
        delete match['lrdate']
        let rls = []
        let prz = {}
        let pP = 0
        Object.keys(match).map(rx=>{
            if(rx.startsWith('rule')){
                rls.push(match[rx])
                delete match[rx]
            }else if(rx.startsWith('prize')){
                pP+=parseInt(match[rx])
                prz[rx.split('-')[1]] = parseInt(match[rx])
                delete match[rx]
            }
            return rx;
        })
        if(Object.keys(prz).length!==0) match['survival'] = prz
        match['prizePool'] = pP;
        if(rls.length!==0) match['customRules'] = rls;
        console.log(match)
        const db = getFirestore();
        db.collection('Matches').get().then((snap)=>{
            const size = snap.size;
            let mname ="MTH" +(2000 + parseInt(size)+1)
            db.collection("Matches").doc(mname).set({
                ...match,
                date:db.Timestamp.fromMillis(md.getTime()),
                lrdate:db.Timestamp.fromMillis(ld.getTime()),
                players:{},
                isTrusted:false,
                game:'PUBGM',
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

export const hostMatch = (rmatch,paid)=>{
    return (dispatch,getState,{getFirebase,getFirestore})=>{
        //Async Code
        const {auth , profile } = getState().firebase;
        const match = {...rmatch}
        const taglist = match.tags ? match.deftag+","+match.tags : match.deftag 
        delete match['tags']
        delete match['deftag']
        let mode = {}
        /**
        let modep = ['team','view','map']
        modep.forEach((x)=>{
            mode[x] = match[x]
            delete match[x]
        }) 
        match['mode'] = mode*/
        match['tags'] = taglist.split(',')
        match.isPaid ? match['fee'] = parseInt(match['fee']) : match['fee'] = 0; 
        match.hasCPK ? match['bKills'] = parseInt(match['bKills']) : delete match['bKills'];
        match['host'] = profile.pubgid;
        match['isTrusted'] = profile.isTrusted;
        match['hRating'] = profile.hRating; 
        let md = new Date(match.mdate)
        let ld = new Date(match.lrdate);
        md.setHours(match.mtime.split(':')[0])
        md.setMinutes(match.mtime.split(':')[1])
        delete match['mdate']
        delete match['mtime']
        delete match['lrdate']
        let prz = {}
        let pP = 0
        match.survival.forEach((rx,inx) => {
            pP+=parseInt(rx)
            prz[inx+1] = parseInt(rx)
        })
        if(Object.keys(prz).length!==0) match['survival'] = prz
        match['prizePool'] = pP;
        let rls = match['rules']
        delete match['rules']
        if(rls.length>0) match['customRules'] = rls;
        if(!match.isSurvival) delete match['survival']
        ['isPaid','isSurvival','hasCPK','matchOnSameDay'].forEach(ix => {
            delete match[ix]
        })
        console.log(match);
        const db = getFirestore();
        db.collection('Matches').get().then((snap)=>{
            const size = snap.size;
            let mname ="MTH" +(2000 + parseInt(size)+1)
            db.collection("Matches").doc(mname).set({
                ...match,
                date:db.Timestamp.fromMillis(md.getTime()),
                lrdate:db.Timestamp.fromMillis(ld.getTime()),
                players:{},
                game:'PUBGM',
                plno:1,
                isActive : true,
                createdAt : db.Timestamp.fromMillis(new Date().getTime())
            }).then(()=>{
                dispatch({type:"CR_MATCH",match});
            }).catch((err)=>{
                //console.error("AN Error Occured : ",err);
                dispatch({type:"CR_MATCH_ERR",err});
            })
        })
    }
}

export const updateMatch = (mid,rmatch)=>{
    return(dispatch,getState,{getFirebase,getFirestore})=>{
        let match = {...rmatch}
        const db = getFirestore();
        console.log("MID : "+mid+" Match : ",match);
        return;
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
        const db = getFirestore();
        if(wallet<match.fee){
            //reportError(db,auth.uid,{msg:"Insufficient Coins! Please, buy required Coins and try again!",date:db.Timestamp.fromMillis(new Date().getTime())})
            dispatch({type:"EN_MATCH_ERR"})
            //dispatch({ type: 'SNACKBAR', variant: 'error', message: "An Error Occured\nTry Again!\n or Contact Admin"});
            dispatch({ type: 'SNACKBAR', variant: 'error', message: "Insufficient Coins! Please, buy required Coins and try again!"});
            return;
        }
        db.collection('Matches').doc(match.id).get().then((doc)=>{
            if(doc.data().plno>=100){
                dispatch({type:"EN_MATCH_ERR"})
                dispatch({ type: 'SNACKBAR', variant: 'error', message: "Match is Full!"});
                return
            }
            const cp = profile.pubgid;
            const {mate1} = userData
            switch(match.mode.team){
                case "Solo":
                    let cpmatches = st.firebase.profile.matches;
                    const isAlRegU = isinDocs(cpmatches,match.id);
                    let players = match.players;
                    const isAlRegM = isPlayerinMatch(players,cp);
                    console.log("isAlRegM : "+isAlRegM+" isAlRegU : "+isAlRegU);
                    let plno = match.plno+1
                    if(!isAlRegM && !isAlRegU){
                        players[cp] = "0-0";
                        db.collection('Matches').doc(match.id).set({
                            players:players,
                            plno:plno
                        },{merge:true}).then(()=>{
                            cpmatches.push(match.id);
                            wallet-=match.fee;
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
                    if(cp===mate1){
                        dispatch({ type: 'SNACKBAR', variant: 'error', message: "Same ID detected! Please, provide proper ID of your mate!"});
                        
                        return
                    }
                    if(wallet<(match.fee * 2)){
                        dispatch({ type: 'SNACKBAR', variant: 'error', message: "Insufficient Coins! Please, buy required Coins and try again!"});
                        return;
                    }
                    db.collection("Users").where('pubgid','==',mate1).get().then(snaps=>{
                        if(snaps.empty) {
                            dispatch({ type: 'SNACKBAR', variant: 'error', message: "Your friend wasn't found. Check Your Mate's PUBGID!"});
                            return;
                        }
                        let players = doc.data().players;
                        let profile2 = snaps.docs[0].data()
                        let cp1matches = st.firebase.profile.matches;
                        let cp2matches = profile2.matches;
                        let parr = [cp,mate1]
                        let isAlRegU = [isinDocs(cp1matches,match.id),isinDocs(cp2matches,match.id)]
                        let isAlRegM = arePlayersinMatch(players,parr);
                        console.log("U : ",isAlRegU," M : ",isAlRegM)
                        if(!isAlRegM[0] && !isAlRegU[0] && !isAlRegM[1] && !isAlRegU[1]){
                            cp1matches.push(match.id)
                            cp2matches.push(match.id)
                            players[cp] = {[cp]:"0-0",[mate1]:"0-0"}
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
                            if(isAlRegM[0] && isAlRegU[0] && isAlRegM[1] && isAlRegU[1]){
                                dispatch({ type: 'SNACKBAR', variant: 'success', message: "Woaah! You`ve already Enrolled in this Match with your friend!"});
                                return;
                            }
                            if(isAlRegM[0] && isAlRegU[0]){
                                dispatch({ type: 'SNACKBAR', variant: 'error', message: "You've already enrolled in this match!"});

                            }
                            if(isAlRegM[1] && isAlRegU[1]){
                                dispatch({ type: 'SNACKBAR', variant: 'error', message: "Your friend has already enrolled in this match!"});
                                return;
                            }
                        }
                    })
                    break;
                case "Squad":
                    const {mate2,mate3} = userData
                    console.log("Squad")
                    if([mate1,mate2,mate3].includes(cp) 
                    || [mate2,mate3].includes(mate1) 
                    || [mate3].includes(mate2)){
                        dispatch({ type: 'SNACKBAR', variant: 'error', message: "Same ID(s) detected! Please, provide proper ID of your mate!"});
                        return
                    }
                    let parr = [mate1,mate2,mate3]
                    if(wallet<(match.fee * 4)){
                        dispatch({ type: 'SNACKBAR', variant: 'error', message: "Insufficient Coins! Please, buy required Coins and try again!"});
                        return;
                    }
                    db.collection("Users").where('pubgid','in',parr).get().then(snaps=>{
                        if(snaps.empty || snaps.size<3) {
                            dispatch({ type: 'SNACKBAR', variant: 'error', message: "Your friend(s) wasn't found. Check Your Mates' PUBGID(s)!"});
                            return;
                        }
                        let players = doc.data().players
                        let plno = doc.data().plno + 4
                        let profiles = []
                        let wallet = profile.wallet - 8
                        profiles.push(profile)
                        profiles.push(snaps.docs[0].data())
                        profiles.push(snaps.docs[1].data())
                        profiles.push(snaps.docs[2].data())
                        console.log(profiles)
                        let cpsmatches = []
                        cpsmatches.push(profiles[0].matches)
                        cpsmatches.push(profiles[1].matches)
                        cpsmatches.push(profiles[2].matches)
                        cpsmatches.push(profiles[3].matches)
                        parr = [cp,...parr]
                        let isAlRegU = cpsmatches.map(cm=>isinDocs(cm,match.id))
                        let isAlRegM = arePlayersinMatch(players,parr);
                        console.log("U : ",isAlRegU," M : ",isAlRegM)
                        if(!isAlRegU.includes(true) && !isAlRegM.includes(true)){
                            cpsmatches.forEach((cpm)=>{
                                cpm.push(match.id)
                            })
                            let pjs = {}
                            parr.forEach(pl=>{
                                pjs[pl]="0-0"
                            })
                            players[cp]=pjs
                            db.collection("Matches").doc(match.id).set({players,plno},{merge:true}).then(()=>{
                                snaps.docs.forEach((docx,ind)=>{
                                    db.collection("Users").doc(docx.id).set({matches:cpsmatches[ind+1]},{merge:true})
                                })
                                db.collection("Users").doc(auth.uid).set({matches:cpsmatches[0],wallet},{merge:true}).then(()=>{
                                    dispatch({ type: 'SNACKBAR', variant: 'success', message: "Success! You`ve enrolled in the match. Happy Looting!"})
                                })
                            })
                        }else{
                            if(!isAlRegM.includes(false) && !isAlRegU.includes(false)){
                                dispatch({ type: 'SNACKBAR', variant: 'success', message: "Woaah! You`ve already Enrolled in this Match with your friend!"});
                                return;
                            }
                        }
                    })
                    break;
                default:
                    break;
            }
        })
    }
}

export const updateFacts = (players,mid,mode)=>{
    return(dispatch,getState,{getFirebase,getFirestore})=>{
        const {team} = mode
        for(let x in players){
            if(players[x].ukills===undefined || players[x].rank===undefined ) {
                alert("Please Fill The Details properly");
                return true;
            }
        }
        const db = getFirestore();
        ufacts(db,players,team).then((plist)=>{
            console.log(plist)
            db.collection("Matches").doc(mid).get().then((doc)=>{
                if(!doc.exists) return;
                let mpl = doc.data().players;
                for(let pl in plist){
                    mpl[pl] = plist[pl]
                }
                console.log(mpl)
                db.collection("Matches").doc(mid).set({players:mpl},{merge:true}).then(()=>{
                    dispatch({type:'MTHF_UPD'})
                })
            })
        })
    } 
}

const ufacts = (db,players,mode)=>{
    return new Promise((resolve,reject)=>{
        let plist = {};
        players.map((pl)=>{
            if(mode==="Solo") plist[pl.pubgid] = pl.ukills+"-"+pl.rank
            else{
                if(pl.ldr) plist[pl.ldr] = {...plist[pl.ldr],[pl.pubgid]:pl.ukills+"-"+pl.rank}
                else {
                    let pid = pl.pubgid.split("'")[0]
                    plist[pid] = {...plist[pid],[pid]:pl.ukills+"-"+pl.rank}
                }
            }
            console.log(pl.kills,pl.ukills)
            db.collection("Users").doc(pl.id).set({
                kills:(parseInt(pl.kills)+parseInt(pl.ukills)),
                wallet:(parseInt(pl.wallet)),
                looted:(parseInt(pl.looted))
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
        const fee = match.fee
        getPlayers(mid,st).then((players)=>{
            let batch = db.batch();
            if(isEmpty(players)) return;
            if(players.length>10){
                let i,incr=10,plength=players.length;
            for(i=0;i<plength;i+=incr){
                let batch = db.batch();
                incr = players && players.length<incr ? players.length : incr
                let nPlayers = players.splice(0,10)
                db.collection("Users").where('pubgid','in',nPlayers).get().then((snaps)=>{
                    snaps.forEach(snap => {
                        let wallet = snap.data().wallet;
                        wallet+=fee;
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
                    }else{
                        batch.commit()
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
                }).then(()=>{
                    batch.commit().then(()=>{
                        dispatch({type:"MTH_CAN_SUCC"})
                    })
                })
            }
        })
    }
}

export const setRoomDetails = (mid,data)=>{
    return(dispatch,getState,{getFirebase,getFirestore})=>{
        console.log(data)
        const db = getFirestore()
        db.collection("Matches").doc(mid).set({...data},{merge:true}).then(()=>{
        })
    }
}

const getPlayers = (mid,st)=>{
    return new Promise((resolve,reject)=>{
        const matches = st.firestore.ordered.Matches;
        const match = matches ? findinMatches(matches,mid) : null;
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
        const winnerData = winner.data
        console.log(winner)
        if(winner.mode.team==="Solo"){
            console.log("Solo")
                db.collection('Users').where('pubgid','==',winnerData.winner_id).get().then((snaps)=>{
                    let winnerSnap = snaps.docs[0];
                    if(snaps.isEmpty || !winnerSnap){
                        dispatch({type:"MTHF_UPDWE",err:"ID Not Found"})
                        return
                    }
                    console.log(winnerSnap.data())
                    winnerData['id']=winnerSnap.id
                    winnerData['kills']=winnerSnap.data().kills;
                    winnerData['wins']=parseInt(winnerSnap.data().wins) + 1
                    //winner['wallet'] =winnerSnap.data().wallet + (winner['ukills'] * winner.unit)
                    db.collection("Users").doc(winnerData.id).set({
                        kills:(winner.kills+parseInt(winnerData.winner_kills)),wins:winnerData.wins
                    },{merge:true}).then(()=>{
                        db.collection("Matches").doc(winner.mid).get().then((doc)=>{
                            if(!doc.exists){
                                dispatch({type:"MTHF_UPDWE",err:"Match Not Found"})
                                return;
                            }
                            let mpl = doc.data().players;
                            mpl[winnerData.winner_id] = winnerData.winner_kills
                            db.collection("Matches").doc(winner.mid).set({players:mpl,winner:winnerData.winner_id},{merge:true}).then(()=>{
                                dispatch({type:'MTHF_UPDW'})
                            })
                        })
                    })
                })
        }else{
            let parr = []
                console.log(winner.mode.team,winnerData)
                db.collection("Matches").doc(winner.mid).get().then((snap)=>{
                    let players = snap.data().players
                    let mwinners = players[winnerData.Leader]
                    if(mwinners===undefined) {
                        console.log("Leader ID Incorrect")
                        return
                    }
                    for(let x in mwinners){
                        if(winnerData[x]===undefined) {
                            console.log("User NF")
                            return
                        }
                        parr.push(x)
                        mwinners[x] = parseInt(winnerData[x])
                    }
                    players[winnerData.Leader] = mwinners
                    console.log(players)
                    db.collection("Matches").doc(winner.mid).set({players,winner:winnerData.Leader},{merge:true}).then(()=>{
                        let batch = db.batch()
                        db.collection("Users").where('pubgid','in',parr).get().then(snaps=>{
                            snaps.forEach(snap=>{
                                let docRef = db.collection('Users').doc(snap.id)
                                batch.update(docRef,{wins:db.FieldValue.increment(1)})
                            })
                            batch.commit().then(()=>{
                                console.log("Done!!!")
                            })
                        })
                    })
                })
        }
    }
}