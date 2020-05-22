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

export const getPlayerfromMatch = (plist,pid,mode)=>{
    return plist[pid]
}

export const buildPlayerList = (mplayers,Users,mode,cols)=>{
    console.log(Users)
    let uinm = []
    let ind = 1;
    for(let x in mplayers){
        let mpkarr = Object.keys(mplayers[x])
        let ldr = Users && findinUsers(Users,x)
        var ux = {};
          // eslint-disable-next-line no-loop-func
        ldr && Users && cols.map(cl=>{
            return  cl==='srno' ? (mode==="Solo" ?ux[cl]=ind++ : ux[cl]=ind ) : (cl==='pubgid' && mode!=="Solo" ? ux[cl]=ldr[cl]+"'s Team" : ux[cl]=ldr[cl])
        })
        if(mode!=="Solo"){
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
                return  cl==='srno' ? mx[cl]=(ind)+(mode==="Duo"?alp[sindx++]:alp[sinx]) : mx[cl]=mate[cl]
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
              matex.push(mx)
            })
            ind++
          uinm.push(...matex)
        }
        let ldrkr = mode==="Solo" ? mplayers[x] : mplayers[x][x];
        let ldruk = ldrkr && parseInt(ldrkr.split('-')[0])
        let ldrr = ldrkr && parseInt(ldrkr.split('-')[1])
        uinm.push({...ux,ukills:ldruk,rank:ldrr,id:ldr.id,looted:ldr.looted,kills:ldr.kills})
        //pljson = {...pljson,[x]:mplayers[x][mpkarr[0]]+mplayers[x][mpkarr[1]]}
    }
    return uinm;
}