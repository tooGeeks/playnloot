/*
  This File Contains All Payment Actions such as Credit Wallet, Manual Payment, etc. 
*/

export const creditWallet = (noofcoins)=>{
    return(dispatch,getState,{getFirebase,getFirestore})=>{
        console.log(noofcoins);
        const st = getState();
        const pth="https://us-central1-playandloot.cloudfunctions.net/paytmpay";
        const method='POST';
        const {profile,auth} = st.firebase;
        if(noofcoins===undefined || noofcoins<1){
            dispatch({type:"CR_WALLET_ERR",err:"Coins Less Than 1"});
        }
        const form = document.createElement('form');
        form.method = method;
        form.action = pth;
        var pdata={
            'fname':profile.pubgid,
            'mno':profile.mno,
            'email':auth.email,
            'noofcns':noofcoins
        };
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

export const manualPayment = (data)=>{
    return(dispatch,getState,{getFirebase,getFirestore})=>{
        console.log("PID : "+data.pubgid+" Amount : "+data.amount);
        const db = getFirestore();
        db.collection('Users').where('pubgid','==',data.pubgid).get().then(snapshot => {
            if(snapshot.empty){
                console.error("PUBG ID : "+data.pubgid+" Not Found");
                throw new Error("PUBG ID : "+data.pubgid+" Not Found");
            }else{
                var usr = snapshot.docs[0];
                var nwamt = (usr.data().wallet)+parseInt(data.amount);
                db.collection("Users").doc(usr.id).set({
                    wallet : nwamt
                },{merge : true});
            }
        }).then(()=>{
            dispatch({type:"MP_SUCCESS"});
        }).catch((err)=>{
            dispatch({type:"MP_ERR",err})
        })
    }
}