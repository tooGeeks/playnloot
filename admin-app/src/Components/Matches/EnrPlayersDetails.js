import React from 'react'
import MaterialTable from 'material-table'
import { TablePagination, TableCell } from '@material-ui/core';



const EnrPlayersDetails = (props)=>{ 
    const {columns,rstate,getUnit,mode,bttnname,players,winner,isEditing,tableMetadata,handlePageChange,handleChangeRowsPerPage} = props;
    const team = mode && mode.team
    const [state,setState] = React.useState();
    const [stableMetadata,setStableMetadata] = React.useState();
    React.useEffect(()=>{
        setState({data:players})
        setStableMetadata({...tableMetadata})
    },[players,tableMetadata])    

    let ptable = <div className="center"><p>Loading Player Details...</p><div className="preloader-wrapper small active center">
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

const DPanel = (props)=>{
    const {rowData} = props
    const {mate} = rowData
    console.log(rowData)
    let mdiv = Object.keys(mate).map((cl)=>{
        return (<TableCell field={cl}>{mate[cl]}</TableCell>)
    })
    return mdiv
}

const colDetails = {srno:{title:'Sr. No.',field:'srno',type:'numeric',editable: 'never'},
              'pubgid':{title:'PUBG ID',field:'pubgid',editable: 'never'},
              'mno':{title:'WhatsApp No.',field:'mno',type:'numeric',editable: 'never'},
              'kills':{title:'Kills',field:'kills',type:'numeric',editable: 'onUpdate'},
              'ukills':{title:'Kills in Match',field:'ukills',type:'numeric',editable: 'onUpdate',defaultSort:'desc'},
              'wallet':{title:'Wallet Amount',field:'wallet',type:'numeric',editable: 'never'},
              'rank':{title:'Rank',field:'rank',type:'numeric',editable: 'onUpdate'},
              'coins':{title:"Coins",field:"coins",type:"numeric",editable:"onUpdate"}
            }


    const cols = columns && columns.map((cl)=>{
        return {...colDetails[cl]}
    })
    

    const editF = {
        onRowAdd:null,
        onRowUpdate:(newData,oldData)=>
        new Promise((resolve,reject)=>{
            setTimeout(()=>{
            let data = state.data;
            let unit = getUnit()
            let inx = data.indexOf(oldData);
            console.log(newData)
            newData['kills']=parseInt(newData['kills'])
            newData['ukills']=parseInt(newData['ukills'])
            newData['wallet']=parseInt(newData['wallet'])
            newData['rank']=parseInt(newData['rank'])
            newData['coins']=parseInt(newData['coins'])
            newData['looted']=parseInt(newData['looted'])
            const jdiff = cJSON(oldData,newData)
            console.log(jdiff)
            if(Object.keys(jdiff)[0]==='coins' && oldData['coins']<newData['coins']){
                let kdiff = newData['coins'] - oldData['coins']
                newData['wallet'] = parseInt(newData['wallet']) + kdiff
                newData['looted'] = parseInt(newData['looted']) + kdiff
            }else if(Object.keys(jdiff)[0]==='coins' && oldData['coins']>newData['coins']){
                let kdiff = oldData['coins'] - newData['coins']
                newData['wallet'] = parseInt(newData['wallet']) - kdiff
                newData['looted'] = parseInt(newData['looted']) - kdiff
            }
            if(oldData.ldr===undefined){
                let mate = data.find(pl=>(pl.ldr && (oldData.pubgid).split("'")[0]===pl.ldr))
                console.log(mate)
                if(mate!==undefined){
                    let minx = data.indexOf(mate);
                    mate['rank'] = newData.rank;
                    data[minx] = mate;
                }
            }
            data[inx] = newData;
            data.sort((a,b)=>{
                return a.rank<b.rank ? 1 : -1;
            })
            /** 
            for(let x in data){
                data[x].rank = parseInt(x)+1
                data[x].srno = parseInt(x)+1
            }
            */
            console.log(data)
            setState({data})
            resolve();
            },1000)
        }),
        onRowDelete : null
    };


    const cJSON = (oj,nj)=>{
        let rj = {};
        for(let key in oj){
            if(oj[key]!==nj[key]) {
                rj[key] = nj[key]
            }
        }
        return rj;
    }
    

    return(
        <React.Fragment>
            <div>
                {state && stableMetadata ? <MaterialTable
                    title="Players"
                    columns={cols}
                    data={state && state.data}
                    editable={isEditing? editF : null}
                    
                    //detailPanel={rowData=>{return(<DPanel rowData={rowData}/>)}}
                    localization={{
                        body:{
                            emptyDataSourceMessage : 'No Players Available'
                        }
                    }}
                    parentChildData = {team!=="Solo" ? (row,rows)=>rows.find((rw)=>rw.pubgid ? (rw.pubgid).split("'")[0]===row.ldr : null) : null}
                    options={{
                        pageSizeOptions:[5,10,15,20],
                        rowStyle:rowData =>(
                            {
                            backgroundColor : (team==="Solo" && winner===rowData.pubgid) || (team!=="Solo" && rowData.pubgid && winner===rowData.pubgid.split("'")[0]) || (winner!==undefined && winner===rowData.ldr) ? '#5DDF93' : '#2B3138'
                        })
                    }}
                    isLoading={!state}
                    components={{
                        Pagination: props=> (
                            <TablePagination
                            {...props}
                            rowsPerPage={stableMetadata && stableMetadata.ppp}
                            rowsPerPageOptions={[1,5,10,15]}
                            count={stableMetadata && stableMetadata.count}
                            page={stableMetadata && stableMetadata.page}
                            
                            onChangePage={(e,page)=>{
                                handlePageChange(page).then((pageUpdate)=>{
                                    setStableMetadata({...pageUpdate.tableMetadata})
                                    setState({data:pageUpdate.players})
                                })
                            }}
                            onChangeRowsPerPage={(e)=>{
                                handleChangeRowsPerPage(e.target.value).then((pageUpdate)=>{
                                    setStableMetadata(pageUpdate.tableMetadata)
                                    setState({data:pageUpdate.players})
                                })
                                }}
                            />
                        )

                    }}  
                /> : ptable}
                <div hidden={!bttnname}>
                    <button onClick={()=>{
                        rstate(state.data)
                        handlePageChange(stableMetadata['page']+1).then((pageUpdate)=>{
                            setStableMetadata(pageUpdate.tableMetadata)
                            setState({data:pageUpdate.players})
                        })}}  className='waves-effect waves-light btn hoverable'>{bttnname}</button>
                </div>
            </div>
        </React.Fragment>
    )
}

export default EnrPlayersDetails;