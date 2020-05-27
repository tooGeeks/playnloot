import firebase from './config/fbconfig'

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

export const dateString = (date, arg)=>{//Returs 'date' in Readable Format Ex. 26 December 2019, Thursday
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
    var cdate=new Date();
    var day=(cdate.getDate()+offset).toString().length<2?"0"+(cdate.getDate()+offset).toString():(cdate.getDate()+offset).toString();
    var month=(cdate.getMonth().valueOf()+1).toString().length<2?"0"+(cdate.getMonth().valueOf()+1).toString():(cdate.getMonth().valueOf()+1).toString();
    var cds=cdate.getFullYear()+"-"+month+"-"+day;
    return cds;
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

export const buildPlayerList = (mplayers,Users,mode,cols)=>{
    const {team} = mode
    let uinm = []
    let ind = 1;
    for(let x in mplayers){
        let mpkarr = Object.keys(mplayers[x])
        let ldr = Users && findinUsers(Users,x)
        var ux = {};
          // eslint-disable-next-line no-loop-func
        ldr && Users && cols.map(cl=>{
            return  cl==='srno' ? (team==="Solo" ?ux[cl]=ind++ : ux[cl]=ind ) : (cl==='pubgid' && team!=="Solo" ? ux[cl]=ldr[cl]+"'s Team" : ux[cl]=ldr[cl])
        })
        if(team!=="Solo"){
          let alp = ['a','b','c','d']
          let mates = 
          Users && mpkarr.map(mpk=>Users && findinUsers(Users,mpk))
          let matex = []
            // eslint-disable-next-line no-loop-func
            mates && Users && mates.forEach((mate,sinx)=>{
              let sindx = 1
              if(mates && mate && mate.pubgid===x) {sindx++;return;}
              let mx = {}
              mates && mate && cols.map(cl=>{
                return  cl==='srno' ? mx[cl]=(ind)+(team==="Duo"?alp[sindx++]:alp[sinx]) : mx[cl]=mate[cl]
              })
              let mu = mate && mplayers && mplayers[x][mate.pubgid];
              let mukills = mu && parseInt(mu.split('-')[0]); 
              let murank = mu && parseInt(mu.split('-')[1]);
              mx['ukills'] = mukills
              mx['kills'] = mate && mate.kills
              mx['rank'] = murank;
              mx['id'] = mate && mate.id
              mx['ldr']=x
              mx['looted'] = mate && mate.looted
              mx['coins'] = 1
              matex.push(mx)
            })
            ind++
          uinm.push(...matex)
        }
        let ldrkr = team==="Solo" ? mplayers[x] : mplayers[x][x];
        let ldruk = ldrkr && parseInt(ldrkr.split('-')[0])
        let ldrr = ldrkr && parseInt(ldrkr.split('-')[1])
        let ldrid = ldr && ldr.id;
        let ldrlooted = ldr && ldr.looted
        let ldrkills = ldr && ldr.kills
        uinm.push({...ux,ukills:ldruk,rank:ldrr,id:ldrid,looted:ldrlooted,kills:ldrkills,coins:1})
        //pljson = {...pljson,[x]:mplayers[x][mpkarr[0]]+mplayers[x][mpkarr[1]]}
    }
    return uinm;
}
