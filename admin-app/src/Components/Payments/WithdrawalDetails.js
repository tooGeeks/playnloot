import React from 'react';
import moment from 'moment';
import { Card, CardContent, CardActions, Button, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles({
    root:{
        minWidth:"90%",
        marginBottom:"15px"
    }
})

const WithdrawalDetails = (props)=>{
    const classes = useStyles();
    const {details,bttnname,hClick,ukey,columns} = props
    const {fname,pmode,coins,isComplete,mno,reqdate} = details;
    console.log(details,columns)
    const reqdiv = details ? <div>
            <Typography variant="h6">By {fname}</Typography>
            <Typography>Made on : {moment(reqdate.toDate()).calendar()}</Typography>
            <Typography>Coins : {coins}</Typography>
            <Typography>Rs. : {coins*5}</Typography>
            <Typography>WhatsApp No. : {mno}</Typography>
            <Typography>Payment Mode : {pmode}</Typography>
    </div> : null
    const status = isComplete ? <Typography color="primary">Status : Paid</Typography> : <Typography style={{color:"yellow"}}>Status : Pending</Typography>
    return(
        <React.Fragment>
            <Card className={classes.root}>
                <CardContent>
                    {reqdiv}
                    {status}
                </CardContent>
                <CardActions>
                    <Button color="primary" variant="contained" onClick={()=>{hClick(ukey)}}>{bttnname}</Button>
                </CardActions>
            </Card>
        </React.Fragment>
    )
}

export default WithdrawalDetails