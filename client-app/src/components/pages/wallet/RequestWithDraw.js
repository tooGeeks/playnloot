import React, { useState, useEffect } from 'react'
import { compose } from 'redux';
import { firestoreConnect, useFirestoreConnect } from 'react-redux-firebase';
import { useSelector, useDispatch } from 'react-redux';
import { findinMatches } from '../../../Functions'
import { cancelWithdrawal, requestWithdrawal } from '../../../store/actions/PaymentActions';
import {useForm} from "react-hook-form";
import { unit } from '../../../constants';

import { makeStyles, Grid, Container, Card, CardHeader, IconButton, CardContent, Typography, TextField, CardActions, Button, Box } from '@material-ui/core'
import { AttachMoney, CheckCircleOutlined, HourglassEmptyOutlined } from '@material-ui/icons'
import Copyright from '../../layout/Copyright';
import moment from 'moment';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        minHeight: '100vh',
    },
    container: {
        marginTop: theme.spacing(2)
    },
    cardContent: {
        textAlign: "center"
    },
    cardAction: {
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    prevBox: {
        minHeight: '5rem',
        borderRadius: 3,
        boxShadow: 2,
        display: 'flex',
        padding: 10,
        backgroundColor: theme.palette.background.paper,
    },
    penTxt: {
        color: theme.palette.custom.taxi,
    },
    pendingBox: { borderLeft: `4px solid ${theme.palette.custom.taxi}` },
    sucTxt: {
        color: '#81c784'
    },
    successBox: { borderLeft: `4px solid ${theme.palette.custom.greenPaper}` },
    footer: {
        marginTop: 'auto',
        marginBottom: theme.spacing(10)
    }
}))

const RequestWithDraw = () => {
    const [fetchData,setFetchData] = React.useState({start:0,count:3,data:[],length:0,deleted:false})
    const { auth, profile } = useSelector(state => state.firebase)
    useFirestoreConnect([{collection:'Users',doc:auth.uid,
        subcollections:[{collection:'Requests',orderBy:['reqdate','desc'],startAfter:fetchData.start,limit:fetchData.count}],storeAs:'Requests'}])
    const classes = useStyles();
    const fetchReq = useSelector(state => state.firestore.ordered.Requests)
    useEffect(()=>{
        fetchReq && setFetchData(prevFData=>{console.log(fetchReq)
            let xdata = prevFData.data;
            console.log(fetchData.data.length)
            console.log(prevFData)
            if(fetchData.newElem) {
                console.log("WW")
                return {...prevFData,length:fetchReq.length,data:fetchReq}
            }
            if(fetchData.data.length==0){
                fetchReq.push(...xdata)
                return {...prevFData,length:fetchReq.length,data:fetchReq}
            }
            if(fetchData.update) {
                xdata.push(...fetchReq)
                return {...prevFData,length:fetchReq.length,update:false,data:xdata}
            }
        })
    },[fetchReq])
    const dispatch = useDispatch();
    const { register, handleSubmit, errors, reset } = useForm();
    const [ data, setData ] = useState({coins: 0, mno: 0, pmode: ''});
    const handleChange = (e) => {
        setData({...data,[e.target.id]:e.target.value})
    }

    const hMoreReq = ()=>{
        ind++;
        let lastDoc = fetchData.data[fetchData.data.length-1]
        //console.log(lastDoc.id)
        setFetchData(prevFData=>{return {...prevFData,start:lastDoc.reqdate,update:true,newElem:false}})
    }
    let ind = 1;
    const onSubmitRequest = (data, e) => {
        e.preventDefault();
        dispatch(requestWithdrawal({coins: parseInt(data.coins), pmode: data.pmode}));
        reset();
        setData({coins: 0, mno: 0, pmode: ''});
        setFetchData({...fetchData,data: [],newElem:true});
    };
    const deleteElem = (req)=>{
        const inx = fetchData.data.indexOf(req);
        dispatch(cancelWithdrawal({uid:auth.uid,reqid:req.id}));
        //delete requests[inx];
        setFetchData({...fetchData,deleted:true, data: [],start:0})
    }
    //console.log(fetchData.length)
    const requests = fetchData && fetchData.data && fetchData.data.map((req, index) => {
        return (
            <Grid item xs={12} sm={6} key={index}><Box boxShadow={2} justifyContent="center" alignItems="center" className={req.isComplete ? `${classes.prevBox} ${classes.successBox}` : `${classes.prevBox} ${classes.pendingBox}`}>
                <Box display="flex" flexDirection="column" justifyContent="center" style={{width: '20%', textAlign: "center",}}><Box style={{ fontSize: 25, fontWeight: 'fontWeightBold'}}>₹{req.coins*unit}</Box>{req.isComplete ? <Box fontSize={12} className={classes.sucTxt}>Paid</Box> : <Box fontSize={12} className={classes.penTxt}>Pending</Box>}</Box>
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" style={{width: '60%'}}>
                    <Box>{req.pmode}</Box>
                    <Box>{moment(req.reqdate.toDate()).calendar()}</Box>
                    {(!req.isComplete) ? <Button variant="contained" style={{ fontSize: 10, backgroundColor: '#121212', color: '#FFF'}} onClick={() => {deleteElem(req)}}>Cancel</Button> : null}
                </Box>
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" style={{width: '20%'}}>{req.isComplete ? <CheckCircleOutlined style={{ fontSize: 35, color: "#81c784" }} /> : <HourglassEmptyOutlined style={{ fontSize: 35, color: "#fff176" }} />}</Box>
            </Box></Grid>
        )
    })
    return (
        <div className={classes.root}>
            <Container maxWidth="sm" className={classes.container}>
                <Grid item xs={12} id="Request">
                    <form key={1} noValidate onSubmit={handleSubmit(onSubmitRequest)}>
                        <Card varient="outlined" id="get-money">
                            <CardHeader title="Request Withdrawal"
                                subheader="Withdraw your Money"
                                action={
                                <IconButton aria-label="money">
                                    <AttachMoney color="inherit"/>
                                </IconButton>
                            }/>
                            <CardContent>
                                <Grid container direction="row" spacing={2} justify="center" alignItems="flex-start">
                                    <Grid item xs={12}>
                                        <Typography variant="body2">
                                            You have <strong color="primary">{profile.wallet}</strong> coins in your wallet <br/>
                                            Out of it, you can deduct only <strong>{profile.wallet - 1} coins (₹{(profile.wallet - 1)*unit})</strong>, because we gave you that one extra coin XD <br style={{paddingBottom: 5}}/>
                                            Remaining Money After Withdrawal : <strong color="primary">₹{(profile.wallet - data.coins)*unit}</strong>
                                        </Typography>
                                    </Grid>
                                    <Grid container item xs={12} spacing={2} justify="flex-start" alignItems="center">
                                        <Grid item xs={12} sm={6}>
                                            <Box textAlign="center" fontSize={60} fontWeight="fontWeightMedium">₹
                                                <Box display="inline-block" fontSize={100} fontWeight="fontWeightBold">{(data.coins)>0 ? `${data.coins*unit}` : `0`}</Box>
                                            </Box>
                                        </Grid>
                                        <Grid container item xs={12} sm={6} spacing={1}>
                                            <Grid item xs={6}>
                                                <TextField variant="filled" fullWidth size="small" required name="coins" id="coins" label="No of Coins" type="number"
                                                    onChange={handleChange}
                                                    helperText={errors.coins ? errors.coins.type ==="required" ? "You forgot this!" : errors.coins.type==="withinAvail" ? `You can only deduct ${profile.wallet - 1} coins` : null : "eg. 2 coins ie. ₹10"}
                                                    InputLabelProps={{ shrink: true, }}
                                                    inputRef={ register({
                                                            required: true,
                                                            validate: {
                                                                withinAvail: value => parseInt(value)<profile.wallet || "You don`t have these much coins!"
                                                            }
                                                    })}
                                                    error={!!errors.coins}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField id="pmode" name="pmode" fullWidth select label="Payment Mode" onChange={handleChange}
                                                  value={data.pmode} SelectProps={{ native: true, }}
                                                  inputRef={ register({ required: true, }) } variant="filled" size="small"
                                                  helperText={`Payment Option`}
                                                >
                                                    {['UPI', 'Bank Transfer', 'Cash'].map((option) => (
                                                  <option key={option} value={option}>
                                                    {option}
                                                  </option>
                                                ))}
                                                </TextField>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField variant="filled" fullWidth size="small" required name="mno" id="mno" label="Confirm Mobile No."
                                                    type="number" onChange={handleChange} InputLabelProps={{ shrink: true, }}
                                                    inputRef={
                                                        register({ required: true, minLength: { value: 10 },
                                                            validate: {  matchNos: value => parseInt(value) === profile.mno || "" },
                                                        })
                                                    }
                                                    error={!!errors.mno}
                                                    helperText={(errors.mno ? (errors.mno.type === 'required' ? "Mobile No is must!" : errors.mno.type === 'minLength' ? "No. is of 10 digits" : errors.mno.type === 'matchNos' ? "No. didn`t match!" : null) : "eg. 9850000000")}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </CardContent>
                            <CardActions>
                                <Button type="submit" className={classes.cardAction} style={{minWidth: 160}} 
                                    variant="contained" 
                                    color="primary" disabled={((data.coins)<=0)}>
                                        Request {(data.coins)>0 ? `₹${data.coins*unit}` : null}
                                </Button>
                            </CardActions>
                        </Card>
                    </form>
                </Grid>
                <Grid item xs={12}><Box fontSize="h6.fontSize" letterSpacing={1} textAlign="left" padding={2}>Previous Requests</Box></Grid>
                <Grid container item xs={12} spacing={1} id="PrevRequests" justify="flex-start" alignItems="flex-start">
                    {requests}
                </Grid>
                { ((fetchData && fetchData.length!==0)) ? <Button variant='text' color='primary' onClick={hMoreReq}>Show More...</Button> : <Typography color='primary'>No Requests Available</Typography> }
            </Container>
            <footer className={classes.footer}>
                <Copyright />
            </footer>
        </div>
    )
}

/**

export default compose(
    firestoreConnect([
        {collection:'WithdrawalRequests'}
    ])
)(RequestWithDraw)
 */
export default RequestWithDraw;