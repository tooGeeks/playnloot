import {getCurrentDate, getOS, getCDT} from '../../Functions'

/*
  This File Contains All Payment Actions such as Credit Wallet, Manual Payment, etc. 
*/

//unit for one coin (Wallet.js)
const unit = 5;

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
                    'datetime':getCDT()
                };
                break;
            case "AdminPayment":
                alert(JSON.stringify(data))
                pdata={
                    ...data,
                    'datetime':getCDT()
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

export const requestWithdrawal = (data)=>{
    return(dispatch,getState,{getFirebase,getFirestore})=>{
        const st = getState();
        const db = getFirestore();
        db.collection('WithdrawalRequests').doc(st.firebase.auth.uid).get().then((snap)=>{
            if(!snap.exists){
                db.collection('WithdrawalRequests').doc(st.firebase.auth.uid).set({
                    fname:st.firebase.auth.displayName,
                    mno:st.firebase.profile.mno,
                    requests:[{
                        isComplete:false,
                        reqdate : getCurrentDate(),
                        ...data
                    }]
                }).then(()=>{
                    dispatch({type:"RW_SUCCESS"})
                    dispatch({ type: 'SNACKBAR', variant: 'success', message: `Success! You\`ve requested for ₹${data.coins*unit}, Method: ${data.pmode}. We\`ll pop the admin! [Repeat]`});
                })
            }else{
                let rarr = snap.data().requests;
                rarr.push({
                    isComplete:false,
                    reqdate : getCurrentDate(),
                    ...data 
                })
                db.collection('WithdrawalRequests').doc(st.firebase.auth.uid).set({
                    requests:rarr
                },{merge:true}).then(()=>{
                    dispatch({type:"RW_SUCCESS"})
                    dispatch({ type: 'SNACKBAR', variant: 'success', message: `Success! You\`ve requested for ₹${data.coins*unit}, Method: ${data.pmode}. We\`ll pop the admin!`});
                })
            }
            
        })
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
                })
            })
        })
    }
}

export const cancelWithdrawal = (reqid)=>{
    return(dispatch,getState,{getFirebase,getFirestore})=>{
        const uid = reqid.split('-')[0]
        const ind = reqid.split('-')[1]
        const db = getFirestore();
        db.collection('WithdrawalRequests').doc(uid).get().then(snap=>{
            let arr = snap.data().requests;
            arr.splice(ind,1);
            db.collection('WithdrawalRequests').doc(uid).set({
                requests:arr
            },{merge:true}).then(()=>{
                dispatch({type:'RW_CAN'})
            })
        })
    }
}