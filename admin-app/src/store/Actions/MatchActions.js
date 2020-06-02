import {findinMatches} from '../../Functions'
import 'firebase/functions'
import { isEmpty } from 'react-redux-firebase';

export const createMatch = (rmatch)=>{
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
        match['fee'] = parseInt(match['fee'])
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
        Object.keys(match).map(rx=>{
            if(rx.startsWith('rule')){
                rls.push(match[rx])
                delete match[rx]
            }else if(rx.startsWith('prize')){
                prz[rx.split('-')[1]] = parseInt(match[rx])
                delete match[rx]
            }
            return rx;
        })
        match['survival'] = prz
        match['customRules'] = rls;
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

export const updateMatch = (mid,rmatch)=>{
    return(dispatch,getState,{getFirebase,getFirestore})=>{
        let match = {...rmatch}
        const db = getFirestore();
        console.log("MID : "+mid+" Match : ",match);
        db.collection("Matches").doc(mid).set({...match},{merge:true}).then(()=>{
            dispatch({type:"UD_MATCH"});
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