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

export const dateString = (date)=>{//Returs 'date' in Readable Format Ex. 26 December 2019, Thursday
    const cd = new Date(date);
    const months = ["January","February","March","April","May","June","July","August","September","Octocber","November","December"]
    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
    return cd.getDate() + " " + months[cd.getMonth()] + " " + cd.getFullYear() + ", " + days[cd.getDay()];
}

export const isinDocs = (docs,id)=>{//Used to Check if a certain doc exists in a given list.
    return docs.find((doc)=>id===doc) ? true : false;
}
export const isPlayerinMatch = (docs,id)=>{//Used to Check if a certain doc exists in a given list.
    return docs.find((doc)=>{
        for(let x in doc) return id===x
        return doc;
    }) ? true : false;
}
export const findinMatches = (docs,id)=>{//Used to Find and return a match using its name Ex. MTH2001
    return docs.find((doc)=>id===doc.id);
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

export const getCurrentDate = ()=>{//Used to retrieve today's date in required format
    var cdate=new Date();
    var day=cdate.getDate().toString().length<2?"0"+cdate.getDate().toString():cdate.getDate().toString();
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


  
