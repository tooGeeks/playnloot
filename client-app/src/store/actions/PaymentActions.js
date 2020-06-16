import {getOS, reportError} from '../../Functions'
import { unit } from '../../constants'
import { showSnackbar } from './uiActions';

/*
  This File Contains All Payment Actions such as Credit Wallet, Manual Payment, etc. 
*/

export const creditWallet = (data)=>{
    return(dispatch,getState,{getFirebase,getFirestore})=>{
        console.log(data.noofcns);
        const st = getState();
        const pth="https://us-central1-playandloot.cloudfunctions.net/paytmpay";
        const method='POST';
        const {profile,auth} = st.firebase;
        if(data.noofcns===undefined || data.noofcns<1){
            dispatch({type:"CR_WALLET_ERR",err:"Coins Less Than 1"});
        }
        const form = document.createElement('form');
        form.method = method;
        form.action = pth;
        var pdata={};
        switch(data.mode){
            case "PayTM":
                pdata={
                    'fname':profile.pubgid,
                    'mno':profile.mno,
                    'email':auth.email,
                    ...data,
                    'platform':getOS(),
                    'datetime':new Date()
                };
                break;
            case "Cash":
                alert(JSON.stringify(data))
                pdata={
                    ...data,
                    'datetime':new Date()
                };
                break;
                default:
                    break;
        }
        for (const key in pdata) {
            let hiddenField = document.createElement('input');
            hiddenField.type = 'hidden';
            hiddenField.name = key;
            hiddenField.value = pdata[key];
            form.appendChild(hiddenField);
        }
        document.body.appendChild(form);
        dispatch({type:"CR_WALLET"})
        form.submit();
    }
}

export const creditWithRazor = (id,data)=>{
    return(dispatch, getState, {getFirebase, getFirestore}) => {
        const { profile, auth } = getState().firebase;
        const db = getFirestore();
        const nwamt = data.success ? (data.amount/unit) + profile.wallet : profile.wallet ;
        db.collection("Users").doc(auth.uid).collection("Orders").doc(id).set({...data}).then(()=>{
            if(data.success){
                db.collection("Users").doc(auth.uid).set({wallet:nwamt},{merge:true}).then(()=>{
                    dispatch(showSnackbar({variant: 'success', message: `You credited Rs. ${data.amount}. You now have ${profile.wallet} coins in your wallet`}));
                }).catch((err)=>{
                    console.log("An Error Occured",err);
                })
            }else{
                dispatch(showSnackbar({variant: 'error', message: `An Error Occured.\n Couldn't process your payment.\n Try Again in some time!`}))
            }
        }).catch((err)=>{
            console.log(err)
            //resolve(false);
        });
    }
}

export const requestWithdrawal = (data)=>{
    return(dispatch,getState,{getFirebase,getFirestore})=>{
        const st = getState();
        const db = getFirestore();
        const {auth, profile} = st.firebase
        console.log(new Date().getTime());
        const uid = auth.uid
        db.collection('WithdrawalRequests').add({
            isComplete : false,
            uid,
            mno : profile.mno,
            pubgid : profile.pubgid,
            reqdate : db.Timestamp.fromMillis(new Date().getTime()),
            ...data
        }).then(()=>{
            db.collection('Users').doc(uid).set({wallet:profile.wallet-data.coins},{merge:true}).then(()=>{
                dispatch({type:"RW_SUCCESS"})
                dispatch({ type: 'SNACKBAR', variant: 'success', message: `Success! You've requested for ₹${data.coins*unit}, Method: ${data.pmode}. We\`ll pop the admin! [Repeat]`});
            })
        }).catch((err)=>{
            reportError(db,uid,{date:db.Timestamp.fromMillis(new Date().getTime()),...err}).then(()=>{
                dispatch({type:'RW_ERR'})
            })
        })
        return;
    }
}

export const confirmWithdrawal = (reqid)=>{
    return(dispatch,getState,{getFirebase,getFirestore})=>{
        console.log(reqid);
        const db = getFirestore();
        const uid = reqid.split('-')[0];
        const ind = reqid.split('-')[1];
        db.collection('WithdrawalRequests').doc(uid).get().then(snap=>{
            let arr = snap.data().requests;
            let req = arr[ind];
            req.isComplete = true;
            arr.splice(ind,1);
            arr.push(req)
            db.collection('Users').doc(uid).get().then(snap=>{
                db.collection('Users').doc(uid).set({wallet:snap.data().wallet-req.coins},{merge:true}).then(()=>{
                    db.collection('WithdrawalRequests').doc(uid).set({
                        requests:arr
                    },{merge:true})
                }).then(()=>{
                    dispatch({type:'RW_CNF'})
                }).catch((err)=>{
                    reportError(db,uid,{date:db.Timestamp.fromMillis(new Date().getTime()),...err}).then(()=>{
                        dispatch({type:'RW_CNF_ERR'})
                    })
                })
            })
        })
    }
}
 

export const cancelWithdrawal = ({uid,reqid})=>{
    return(dispatch,getState,{getFirebase,getFirestore})=>{
        const st = getState();
        const { auth, profile } = st.firebase;
        const db = getFirestore();
        db.collection('WithdrawalRequests').doc(reqid).get().then(snap=>{
            if(snap.empty) return;
            let req = snap.data();
            console.log(req)
            if(req.isComplete){
                dispatch({type:'RW_CAN_ERR'})
                dispatch({type:'SNACKBAR',variant:'error',message:'Your Request is already Confirmed'})
            }
            db.collection('Users').doc(uid).set({wallet:profile.wallet+req.coins},{merge:true}).then(()=>{
                db.collection('WithdrawalRequests').doc(reqid).delete().then(()=>{
                    dispatch({type:'RW_CAN'})
                }).catch((err)=>{
                    reportError(db,uid,{date:db.Timestamp.fromMillis(new Date().getTime()),err:err.message}).then(()=>{
                        dispatch({type:'RW_CAN_ERR'})
                    })
                })
            })
            .catch((err)=>{
                reportError(db,uid,{date:db.Timestamp.fromMillis(new Date().getTime()),...err}).then(()=>{
                    dispatch({type:'RW_CAN_ERR'})
                })
            })
        })
    }
}