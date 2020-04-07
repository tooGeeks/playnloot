import React, { Fragment } from 'react'
import MaterialTable from 'material-table'



const EnrPlayersDetails = (props)=>{
    const {columns,rstate,bttnname,players,colValues,isEditing} = props;
    const [state,setState] = React.useState();
    React.useEffect(()=>{
        setState(players)
    },[players])
    let cnt=0;
    const inc = ()=>{
        cnt++;
    }
    const hChange = (e)=>{
        if(e.target.textContent==='') return;
        let idn = (e.target.id).split('-')[0];
        console.log(e.target.id);
        let arr = [...state]
        let x = state[idn];
        switch((e.target.id).split('-')[1]){
            case 'kills':
                x['ukills']=parseInt(e.target.textContent);
                x['uwallet']=parseInt(e.target.textContent)*5;
                break;
            case 'rank':
                x['rank']=parseInt(e.target.textContent);
                break;
            default:
                break;
        }
        arr[idn]=x;
        setState(arr)
    }
    //const ip = <div className='input-field col s2 m2'><input className="white-text" type='number'/></div>;
    let ptable = players ? <table className="responsive-table">
    <thead>
        <tr>
            <th className="center">S.No.</th>
            {columns && columns.map(x=>{
                if(x==='kills' && isEditing) return <Fragment key={"LOL"}><th className="center" key={x}>{colValues[x]}</th><th></th><th className="center" key={x+'m'}>{"Kills in Match"}</th></Fragment>
                return <th className="center" key={x}>{colValues[x]}</th>
            })}
        </tr>
    </thead>
    <tbody>
        {players && players.map(pl=>{
            return(
                <tr key={pl.pubgid}>
                    <td className='center'>{cnt+1}</td>
                    {columns.map(cl=>{
                        if(cl==='kills' && isEditing) return(<Fragment key="l1"><td className='center'>{pl[cl]}</td><td className='center'>+</td><td className='center input-field' id={cnt+"-"+cl} onKeyUp={hChange} suppressContentEditableWarning={true} contentEditable={true} key={'e'+cl}>{pl['u'+cl]}</td></Fragment>)
                        if(cl==='rank' && isEditing) return(<Fragment key="rnk"><td className='center input-field' id={cnt+"-"+cl} onKeyUp={hChange} suppressContentEditableWarning={true} contentEditable={true} key={'e'+cl}>{pl[cl]}</td></Fragment>)
                        if(cl==='wallet' && isEditing) return(<td className='center'  key={cl}>{pl[cl]+(isNaN(pl['u'+cl]) ? '' : pl['u'+cl])}</td>)
                        return(<td className='center' key={cl}>{pl[cl]}</td>)
                    })}
                    {inc()}
                </tr>
            )
        })}
    </tbody>
</table> : <div className="center"><p>Loading Player Details...</p><div className="preloader-wrapper small active center">
    <div className="spinner-layer spinner-blue-only">
      <div className="circle-clipper left">
        <div className="circle"></div>
      </div><div className="gap-patch">
        <div className="circle"></div>
      </div><div className="circle-clipper right">
        <div className="circle"></div>
      </div>
    </div>
    </div></div>;
    const colHeads = columns.map((cl)=>{
        return cl==='kills'||cl==='rank'||cl==='wallet'
        ? {title:colValues[cl],field:cl,type:'numeric',editable: 'onUpdate'}
        : {title:colValues[cl],field:cl,editable: 'never'}
    });

    const colData = players && players.map((pl,ind)=>{
        let cp={}
        columns && columns.map((cl,cind)=>{
            return cl==='srno'? cp[cl]=players.indexOf(pl)+1 : cp[cl]=pl[cl]
        })
        return cp;
    })

    const tRef = React.createRef();
    
    const editF = {
        onRowAdd:null,
        onRowUpdate:(newData,oldData)=>
        new Promise((resolve,reject)=>{
            setTimeout(()=>{
            let data = state;
            console.log(state)
            let inx = data.indexOf(oldData);
            newData['kills']=parseInt(newData['kills'])
            newData['wallet']=parseInt(newData['wallet'])
            newData['rank']=parseInt(newData['rank'])
            data[inx] = newData;
            
            resolve();
            },1000)
        }),
        onRowDelete : null
    };
    
    const tRF = ()=>{
    }
    return(
        <React.Fragment>
            <div>
                <MaterialTable
                    tableRef={tRef}
                    title="Players"
                    columns={colHeads}
                    data={state}
                    editable={isEditing? editF : null}
                />
                <div hidden={!bttnname}>
                    <button onClick={()=>console.log(state)}  className='waves-effect waves-light btn hoverable'>{bttnname}</button>
                </div>
            </div>
        </React.Fragment>
    )
}

export default EnrPlayersDetails;