import React, { Fragment } from 'react'

const EnrPlayersDetails = (props)=>{
    const {columns,rstate,bttnname,players,colValues,isEditing} = props;
    const [state,setState] = React.useState(props);
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
    let ptable = players ? <table className="">
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
    return(
        <div>
            {ptable}
            <div hidden={!bttnname}>
                <button onClick={()=>rstate(state)}  className='waves-effect waves-light btn hoverable'>{bttnname}</button>
            </div>
        </div>
    )
}

export default EnrPlayersDetails;