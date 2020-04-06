import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { creditWallet, requestWithdrawal } from '../../store/actions/PaymentActions';
import useForm from "react-hook-form";
import { makeStyles, Container, Grid, Paper, IconButton, TextField, CardHeader, Typography, Card, CardContent, CardActions, Button } from '@material-ui/core';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { showSnackbar } from '../../store/actions/uiActions'


const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        paddingBottom: 60,
    },
    paper: {
        padding: theme.spacing(2),
        //textAlign: 'center',
        //color: theme.palette.text.secondary,
    },
    grid: {
        minHeight: '100vh'
    },
    cardContent: {
        textAlign: "center"
    },
    rsCard: {
        marginLeft: 'auto',
        marginRight: 'auto',
        width: 200,
    },
    buy: {
        marginLeft: 'auto',
        marginRight: 'auto'
    },
}));

//unit for one coin (PaymentActions, Landing.js, Dashboard.js)
const unit = 5;

export default function Wallet(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { use, mny } = props.match.params;
    console.log(props.match.params);

    const { register, handleSubmit, errors, reset } = useForm();
    const {
        register: register2,
        errors: errors2,
        reset: reset2,
        handleSubmit: handleSubmit2
      } = useForm();

    const { profile } = useSelector(
        state => state.firebase
    )
    console.log(profile);
    useEffect(() => {
        if(profile.isLoaded && profile.isLoaded !== undefined){
            switch (use) {
                case "sux":
                    let wallet = profile.wallet;
                    console.log((wallet));
                    dispatch(showSnackbar({variant: 'success', message: `You credited Rs. ${mny}. You now have ${wallet} coins in your wallet`}));
                    break;
                case "fail":
                    dispatch(showSnackbar({variant: 'error', message: `An Error Occured.\n Couldn't process your payment.\n Try Again in some time!`}))
                    break;
                default:
                    break;
            }
        }
        return () => {
            
        }
    }, [profile, use, mny, dispatch])
    const [ coins, setCoins ] = useState({coins:0});
    const [ data, setData ] = useState({coins: 0, mno: 0, pmode: ''});
    
    const handleChange = (e) => {
        setCoins({coins: e.target.value})
    }
    const handleChange2 = (e) => {
        console.log((e.target.id));
        setData({...data,[e.target.id]:e.target.value})
    }
    const onSubmitAddCoin = (data, e) => {
        e.preventDefault();
        dispatch(creditWallet({noofcns:coins.coins,mode:"PayTM"}));
        reset();
        //props.backDrop();
    };
    const onSubmitRequest = (data, e) => {
        e.preventDefault();
        dispatch(requestWithdrawal({coins: data.coins, pmode: data.pmode}));
        reset2();
        setData({coins: 0, mno: 0, pmode: ''});
    }; 

    return (
        <React.Fragment>
            <Container className={classes.root}>
                <Grid container
                    direction="column" justify="center" alignItems="stretch" spacing={2} className={classes.grid}>
                    
                    <Grid item xs={12} id="buyCoins">
                    <form key={1} noValidate onSubmit={handleSubmit(onSubmitAddCoin)}>
                        <Card variant="outlined">
                            <CardHeader title="Buy Coins"
                            subheader="Refill your Wallet"
                            action={
                                <IconButton aria-label="settings">
                                    <AccountBalanceWalletIcon color="inherit"/>
                                </IconButton>
                            }
                            />
                            <CardContent className={classes.cardContent}>
                                { (profile.wallet<2)
                                    ? <Typography className={classes.pos} paragraph color="error">
                                        You have only {profile.wallet} coin!<br/>You need 2 coins to enroll in any match.
                                        <br/>So, Buy atleast {profile.wallet===0 ? '2 coins' : '1 coin'}!
                                    </Typography>
                                    : null
                                }
                                <br />
                            <Paper className={classes.rsCard}>
                                <Typography variant="body2" component="p">
                                1 Coin costs Rs.{unit}!
                                </Typography>
                                    <TextField
                                        variant="filled"
                                        style = {{width: 95}}
                                        size="small"
                                        margin="dense"
                                        required
                                        name="coins"
                                        id="coins"
                                        label="No of coins"
                                        type="number"
                                        onChange={handleChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        inputRef={
                                            register({
                                                required: true,
                                            })
                                        }
                                        error={!!errors.coins}
                                    />
                                <Typography variant="body2" component='p'>
                                    Total: [{coins.coins}] x {unit} = ₹{(coins.coins)*unit}
                                </Typography>
                            </Paper>
                                    

                            </CardContent>
                            <CardActions>
                                    <Button type="submit" className={classes.buy} style={{width: 120}} 
                                        variant="contained" 
                                        color="primary" disabled={((coins.coins)<=0)}>
                                            Pay {((coins.coins)>0) ? ('₹' + (coins.coins)*unit) : null}
                                    </Button>
                            </CardActions>
                        </Card>
                        </form>
                    </Grid>
                    <Grid item xs={12} id="requestWithdraw">
                        <form key={2} noValidate onSubmit={handleSubmit2(onSubmitRequest)}>
                            <Card varient="outlined">
                                <CardHeader title="Request Withdrawal"
                                    subheader="Withdraw your Money"
                                    action={
                                    <IconButton aria-label="money">
                                        <AttachMoneyIcon color="inherit"/>
                                    </IconButton>
                                }/>
                                <CardContent>
                                    <Grid container spacing={1} justify="center" alignItems="center">
                                        <Grid item>
                                            <Typography variant="body2">
                                                You have <strong color="primary">{profile.wallet}</strong> coins in your wallet <br/>
                                                Out of it, you can deduct only <strong>{profile.wallet - 1} coins (₹{(profile.wallet - 1)*unit})</strong>, because we gave you that one extra coin XD <br style={{paddingBottom: 5}}/>
                                                Remaining Money After Withdrawal : <strong color="primary">₹{(profile.wallet - data.coins)*unit}</strong>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                variant="filled"
                                                size="small"
                                                required
                                                name="coins"
                                                id="coins"
                                                label="No of Coins"
                                                type="number"
                                                onChange={handleChange2}
                                                helperText={errors2.coins ? errors2.coins.type ==="required" ? "You forgot this!" : errors2.coins.type==="withinAvail" ? `You can only deduct ${profile.wallet - 1} coins` : null : "eg. 2 coins ie. ₹10"}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                inputRef={
                                                    register2({
                                                        required: true,
                                                        validate: {
                                                            withinAvail: value => parseInt(value)<profile.wallet || "You don`t have these much coins!"
                                                        }
                                                    })
                                                }
                                                error={!!errors2.coins}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                variant="filled"
                                                size="small"
                                                required
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                name="rupees"
                                                id="rupees"
                                                value={data.coins*unit}
                                                label="In Rupees"
                                                disabled
                                                helperText="Total Amount"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                              style={{textAlign: 'center'}}
                                              id="pmode"
                                              name="pmode"
                                              select
                                              label="Payment Mode"
                                              onChange={handleChange2}
                                              value={data.pmode}
                                              SelectProps={{
                                                native: true,
                                              }}
                                              inputRef={
                                                register2({
                                                    required: true,
                                                })
                                              }
                                              helperText="Please select a Payment Mode"
                                              variant="filled"
                                              size="small"
                                            >
                                                {['UPI', 'Bank Transfer', 'Cash'].map((option) => (
                                              <option key={option} value={option}>
                                                {option}
                                              </option>
                                            ))}
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                variant="filled"
                                                size="small"
                                                required
                                                name="mno"
                                                id="mno"
                                                label="Confirm Mobile No."
                                                type="number"
                                                onChange={handleChange2}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                inputRef={
                                                    register2({
                                                        required: true,
                                                        minLength: {
                                                            value: 10
                                                        },
                                                        validate: {
                                                            matchNos: value => parseInt(value) === profile.mno || ""
                                                        },
                                                    })
                                                }
                                                error={!!errors2.mno}
                                                helperText={(errors2.mno ? (errors2.mno.type === 'required' ? "Mobile No is must!" : errors2.mno.type === 'minLength' ? "No. is of 10 digits" : errors2.mno.type === 'matchNos' ? "No. didn`t match!" : null) : "eg. 9850000000")}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                                <CardActions>
                                    <Button type="submit" className={classes.buy} style={{minWidth: 160}} 
                                        variant="contained" 
                                        color="primary" disabled={((data.coins)<=0)}>
                                            Request {(data.coins)>0 ? `₹${data.coins*unit}` : null}
                                    </Button>
                                </CardActions>
                            </Card>
                        </form>
                    </Grid>
                </Grid>
            </Container>
        </React.Fragment>
    );
}