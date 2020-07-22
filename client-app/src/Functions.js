import firebase from './config/fbConfig'
import axios from 'axios'
import { Dvr } from '@material-ui/icons';

export const convt = (opt=0,time)=>{//Used to Convert Time from/to 12hr and 24 hr format
    var cd="";
    var th,tm,ap,h,m;
    switch(opt){
        case 0://12hr to 24hr
            th=parseInt(time.split(':')[0]);
            tm=time.split(':')[1];
            ap=tm.split(" ")[1];
            tm=parseInt(tm.split(" ")[0]);
            if(ap==="AM" || ap==="am")h=th<10?"0"+th:th;
            else h=th+12;
            m=tm<10?"0"+tm:tm;
            cd = h+":"+m;
            break;
        case 1://24hr to 12hr
            th=parseInt(time.split(':')[0]);
            tm=parseInt(time.split(':')[1]);
            ap=th<12?"AM":"PM";
            th=th<=12?th:th-12;
            h=th<10?"0"+th:th;
            m=tm<10?"0"+tm:tm;
            cd = h+":"+m+" "+ap;
            break;
        default:
            break;

    }
    return cd;
}

export const getPrizeNames = (num) => {
    if(num>3 && num<21) return num+"th";
    let nstr = num.toString()
    let ld = parseInt(nstr[nstr.length-1]);
    if(ld>3) return num+"th";
    switch(ld){
        case 1:
            return num+"st"
        case 2:
            return num+"nd"
        case 3:
            return num+"rd"
    }
}

export const dateString = (date, arg) => {//Returs 'date' in Readable Format Ex. 26 December 2019, Thursday
    const cd = new Date(date);
    const months = ["January","February","March","April","May","June","July","August","September","Octocber","November","December"]
    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
    if(arg === 'full') return (cd.getDate() + " " + months[cd.getMonth()] + " " + cd.getFullYear() + ", " + days[cd.getDay()])
    else return (cd.getDate() + " " + months[cd.getMonth()]);
}

export const isinDocs = (docs,id)=>{//Used to Check if a certain doc exists in a given list.
    return docs.find((doc)=>id===doc) ? true : false;
}
export const isPlayerinMatch = (docs,id, mode="Solo")=>{//Used to Check if a certain doc exists in a given list.
    if(mode==="Solo"){
        console.log(mode)
            return Object.keys(docs).find((doc)=>{
                return id===doc
                }) ? true : false;
    }
    else{
        let barr = []
        Object.keys(docs).forEach((doc)=>{
            Object.keys(docs[doc]).forEach((doc1)=>{
                console.log(id)
                barr.push(doc1===id)
            })
        })
        console.log(barr)
        return barr.length===0 ? false : (barr.includes(true))
    }
}

export const arePlayersinMatch= (docs,ids)=>{
    if(!docs || docs.length===0 || !ids || ids.length===0) return false;
    if(ids.length===1){
        return Object.keys(docs).find((doc)=>{
            return ids[0]===doc
            }) ? true : false;
    }else{
            let ljs;
            ids.forEach(idx=>{
                if(docs[idx]!==undefined){
                    ljs = docs[idx]
                    return;
                }
            })
            console.log(ljs)
            let larr = ljs===undefined ? null : Object.keys(ljs)
            if(ljs===undefined){
                return ids.map(x=>{return false})
            }
            else return ids.map(k=>{return larr.includes(k)})
    }
}

export const getPlayerfromMatch = (plist,pid,mode)=>{
    if(!plist || plist.length===0 || !pid) return null;
    if(mode==="Solo") return plist[pid]
    else{
        for(let x in plist){
            if(x===pid){
                return plist[x][x];
            }
        }
        for(let x in plist){
            for(let y in plist[x]){
                if(y===pid) return plist[x][y];
            }
        }
    }
}

export const findinMatches = (docs,id)=>{//Used to Find and return a match using its name Ex. MTH2001
    return docs.find((doc)=>id===doc.id);
}

export const findinUsers = (Users,pubgid)=>{
    return Users.find((doc)=>pubgid===doc.pubgid);
}

export const compdate = (d1,d2)=>{//Used to Compare Dates d1 is before d2
    if(d1.split("-")[2].valueOf()>=d2.split("-")[2].valueOf()){
        if(d1.split("-")[1].valueOf()<d2.split("-")[1].valueOf() && d1.split("-")[0].valueOf()<=d2.split("-")[0].valueOf()){
            return true;
        }else if(d1.split("-")[1].valueOf()>=d2.split("-")[1].valueOf() && d1.split("-")[0].valueOf()<d2.split("-")[0].valueOf()){
            return true;
        }
    }else{
        if(d1.split("-")[1].valueOf()<=d2.split("-")[1].valueOf() && d1.split("-")[0].valueOf()<=d2.split("-")[0].valueOf()){
            return true;
        }else if(d1.split("-")[1].valueOf()>d2.split("-")[1].valueOf() && d1.split("-")[0].valueOf()<d2.split("-")[0].valueOf()){
            return true;
        }
    }
    return false;
}

export const getCurrentDate = (offset=0)=>{//Used to retrieve today's date in required format
    let cdate=new Date();
    let day=(cdate.getDate()+offset).toString().length<2?"0"+(cdate.getDate()+offset).toString():(cdate.getDate()+offset).toString();
    let month=(cdate.getMonth().valueOf()+1).toString().length<2?"0"+(cdate.getMonth().valueOf()+1).toString():(cdate.getMonth().valueOf()+1).toString();
    let cds=cdate.getFullYear()+"-"+month+"-"+day;
    return cds;
}

export const getInputDateTime = (opt=0,cdate) => {
    switch(opt){
        case 0:
            let day=(cdate.getDate()).toString().length<2?"0"+(cdate.getDate()).toString():(cdate.getDate()).toString();
            let month=(cdate.getMonth().valueOf()+1).toString().length<2?"0"+(cdate.getMonth().valueOf()+1).toString():(cdate.getMonth().valueOf()+1).toString();
            return cdate.getFullYear()+"-"+month+"-"+day;
        case 1:
            let hrs = cdate.getHours()<10 ? "0"+cdate.getHours().toString() : cdate.getHours().toString()
            let mins = cdate.getMinutes()<10 ? "0"+cdate.getMinutes().toString() : cdate.getMinutes().toString()
            let tm = hrs+":"+mins;
            console.log(tm)
            return tm
    }
    
}

export const getCDT = ()=>{
    var cdate=new Date();
    var day=cdate.getDate().toString().length<2?"0"+cdate.getDate().toString():cdate.getDate().toString();
    var month=(cdate.getMonth().valueOf()+1).toString().length<2?"0"+(cdate.getMonth().valueOf()+1).toString():(cdate.getMonth().valueOf()+1).toString();
    var time = cdate.getHours()+":"+cdate.getMinutes()+":"+cdate.getSeconds();
    var cds=cdate.getFullYear()+"-"+month+"-"+day+" "+time;
    return cds;
}

export const matchStr = (str, rule)=>{//Used to match any sequence of characters in given sequence
    var escapeRegex = (str) => str.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1");
    return new RegExp("^" + rule.split("*").map(escapeRegex).join(".*") + "$").test(str);
}

export const getOS = ()=>{
    var userAgent = window.navigator.userAgent,
        platform = window.navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'],
        os = null;
  
    if (macosPlatforms.indexOf(platform) !== -1) {
      os = 'Mac OS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      os = 'Windows';
    } else if (/Android/.test(userAgent)) {
      os = 'Android';
    } else if (!os && /Linux/.test(platform)) {
      os = 'Linux';
    }
    return os;
}

export const reportError = (db,uid,error)=>{
      return new Promise((resolve,reject)=>{
        console.log(error)
        db.collection("Logs").doc(uid).get().then((doc)=>{
          if(!doc.exists){
            db.collection("Logs").doc(uid).set({errors:[{...error}]}).then(()=>{
              resolve(true)
            })
          }else{
            let errors = doc.data().errors
            errors.push({...error})
            db.collection("Logs").doc(uid).set({errors},{merge:true}).then(()=>{
                resolve(true)
            })
          }
        })
      })
}

export const askPermission = async (messaging)=>{
    try{
        await messaging.requestPermission();
        const token = await messaging.getToken();
        console.log("Token : ",token);
        localStorage.setItem("notification-token",token);
        const db = firebase.firestore();
        console.log(firebase.auth());
        const uid = firebase.auth().currentUser.uid;
        db.collection("Users").doc(uid).set({messageToken:token},{merge:true}).then(()=>{
            db.collection("Notifications").doc("messageTokens").get().then(snap=>{
                if(snap.empty) return;
                let tokens = snap.data().tokens;
                tokens.push(token)
                db.collection("Notifications").doc("messageTokens").set({tokens},{merge:true}).then(()=>{
                    console.log("Token Added")
                })
            })
        })
        return token;
    }
    catch(error){
        console.error(error);
    }
}

export const useQuery = (usLoc) => {
    return new URLSearchParams(usLoc().search);
}

export const createRazorPayDialog = (amount,description="Yarrr! Mat Pucho!",prefill,notes={},callback=(res)=>{console.log(res)}) => {
    const ran = Math.floor(Math.random() * 100000 + 100000).toString();
    var options = {
        key: "rzp_test_TNrd2Wjvj69WTW",
        amount, /// The amount is shown in currency subunits. Actual amount is ₹599.
        name: "PNLooT",
        currency: "INR", // Optional. Same as the Order currency
        description,
        image: "/imgs/icon-512x512.png",
        handler:  (response) =>{
          verifySign(response,callback);
        },
        prefill,
        notes,
        theme: {
            color: "#000000"
        }
    };
    return axios.post("https://playnloot-vercel-functions.now.sh/api/?action=createOrder&amt="+parseInt(amount)+"&receipt=receipt_"+ran).then(res => {
            console.log(res);
            // eslint-disable-next-line no-undef
            var rzp = new Razorpay({...options,order_id:res.data.id});
            return {rzp,resData:res.data};
        }).catch((err) => {
            console.log("ERR",err);
        })
}

export const verifySign = (res,callback
    ) => {
        axios.post("https://playnloot-vercel-functions.now.sh/api/?action=conSign&rpay_orderid="+res.razorpay_order_id+"&rpay_sign="+res.razorpay_signature+"&rpay_paymentid="+res.razorpay_payment_id)
            .then((resx) => {
                callback(resx);
                //cdate.setTime(rpayData.created_at)
                //dispatch(creditWithRazor(res.razorpay_order_id,{...resx.data,amount:(rpayData.amount/100),receipt:rpayData.receipt,createdAt:cdate,mode:'RPAY'}))
        })
}

export const deductCoins = (db,coins,uid) => {
    new Promise((resolve,reject) => {
        db.collection('Users').doc(uid).get().then((snap) => {
            if(snap.empty) return;
            let wallet = snap.data().wallet;
            wallet -= coins;
            db.collection('Users').doc(uid).set({wallet},{merge:true}).then(() => {
                resolve(wallet);
            }).catch(err => {
                reject(err);
            })
        }).catch(err => {
            reject(err);
        });
    })
}

export const createOrder = (db,uid,id,data) => {
    return new Promise((resolve,reject) => {
        db.collection("Users").doc(uid).collection("Orders").doc(id).set({...data}).then(() => {
            resolve(true);
        }).catch((err) => {
            reject(false);
        })
    })
}