import React, { useState } from 'react'
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { useSelector, useDispatch } from 'react-redux';
import { findinMatches } from '../../../Functions'
import { cancelWithdrawal, requestWithdrawal } from '../../../store/actions/PaymentActions';
import useForm from "react-hook-form";

import { makeStyles, Grid, Container, Card, CardHeader, IconButton, CardContent, Typography, TextField, CardActions, Button, Box } from '@material-ui/core'
import { AttachMoney } from '@material-ui/icons'
import Copyright from '../../layout/Copyright';

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
        width: '10rem', 
        height: '10rem', 
        backgroundColor: theme.palette.background.paper,
        borderRadius: 4,
        boxShadow: 2,
        display: 'flex',
        flexDirection: 'column',
        padding: 10,
    },
    footer: {
        marginTop: 'auto',
        marginBottom: theme.spacing(10)
    }
}))

//unit for one coin (PaymentActions, Landing.js, Dashboard.js)
const unit = 5;

const RequestWithDraw = () => {
    const classes = useStyles();
    const { auth, profile } = useSelector(state => state.firebase)
    const users = useSelector(state => state.firestore.ordered.WithdrawalRequests)
    const dispatch = useDispatch();
    
    const { register, handleSubmit, errors, reset } = useForm();
    const [ data, setData ] = useState({coins: 0, mno: 0, pmode: ''});
    const handleChange2 = (e) => {
        console.log((e.target.id));
        setData({...data,[e.target.id]:e.target.value})
    }

    const onSubmitRequest = (data, e) => {
        e.preventDefault();
        dispatch(requestWithdrawal({coins: data.coins, pmode: data.pmode}));
        reset();
        setData({coins: 0, mno: 0, pmode: ''});
    }; 

    const usr = auth && users && findinMatches(users, auth.uid);
    const requests = usr && usr.requests.map(req => {
        console.log(req)
        return (
            null
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
                                                    onChange={handleChange2}
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
                                                <TextField id="pmode" name="pmode" fullWidth select label="Payment Mode" onChange={handleChange2}
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
                                                    type="number" onChange={handleChange2} InputLabelProps={{ shrink: true, }}
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
                <Grid container item xs={12} spacing={1} id="PrevRequests" justify="center" alignItems="flex-start">
                    <Grid item xs={6} sm={4}><Box boxShadow={2} className={classes.prevBox}>
                        <Box textAlign="center">Cash</Box>
                        <Box display="flex" flexDirection="row">
                            <Box>40</Box>
                            <Box>200</Box>
                        </Box>
                        <Box>On: 2020-02-29</Box>
                        <Box>Status: Pending</Box>
                        <Box textAlign="center"><Button variant="outlined" size="small">Cancel</Button></Box>
                    </Box></Grid>
                    <Grid item xs={6} sm={4}><Box boxShadow={2} className={classes.prevBox}></Box></Grid>
                    <Grid item xs={6} sm={4}><Box boxShadow={2} className={classes.prevBox}></Box></Grid>
                    <Grid item xs={6} sm={4}><Box boxShadow={2} className={classes.prevBox}></Box></Grid>
                    <Grid item xs={6} sm={4}><Box boxShadow={2} className={classes.prevBox}></Box></Grid>
                </Grid>
            </Container>
            <footer className={classes.footer}>
                <Copyright />
            </footer>
        </div>
    )
}

export default compose(
    firestoreConnect([
        {collection:'WithdrawalRequests'}
    ])
)(RequestWithDraw)