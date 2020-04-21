import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { creditWallet, } from '../../../store/actions/PaymentActions';
import useForm from "react-hook-form";
import { makeStyles, Container, Grid, Paper, IconButton, TextField, CardHeader, Typography, Card, CardContent, CardActions, Button, Box } from '@material-ui/core';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import { showSnackbar } from '../../../store/actions/uiActions'
import Copyright from '../../layout/Copyright'
import { CheckCircleOutlined, HourglassEmptyOutlined, HighlightOff } from '@material-ui/icons';


const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column',
        minHeight: '100vh',
    },
    container: {
        marginTop: theme.spacing(2)
    },
    paper: {
        padding: theme.spacing(2),
        //textAlign: 'center',
        //color: theme.palette.text.secondary,
    },
    totalCoins: {
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
    prevBox: {
        minHeight: '5rem',
        borderRadius: 3,
        boxShadow: 2,
        display: 'flex',
        color: '#000',
        padding: 10,
    },
    pendingBox: { backgroundColor: theme.palette.error.dark },
    successBox: { backgroundColor: '#81c784' },
    footer: {
        marginTop: 'auto',
        marginBottom: theme.spacing(10)
    }
}));

//unit for one coin (PaymentActions, Landing.js, Dashboard.js)
const unit = 5;

export default function Wallet(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { use, mny } = props.match.params;

    const { register, handleSubmit, errors, reset } = useForm();

    const { profile } = useSelector(
        state => state.firebase
    )
    useEffect(() => {
        if(profile.isLoaded && profile.isLoaded !== undefined){
            switch (use) {
                case "sux":
                    let wallet = profile.wallet;
                    dispatch(showSnackbar({variant: 'success', message: `You credited Rs. ${mny}. You now have ${wallet} coins in your wallet`}));
                    break;
                case "fail":
                    dispatch(showSnackbar({variant: 'error', message: `An Error Occured.\n Couldn't process your payment.\n Try Again in some time!`}))
                    break;
                default:
                    break;
            }
        }
    }, [profile, use, mny, dispatch])
    const [ coins, setCoins ] = useState({coins:0});
    
    const handleChange = (e) => {
        setCoins({coins: e.target.value})
    }
    const onSubmitAddCoin = (data, e) => {
        e.preventDefault();
        dispatch(creditWallet({noofcns:coins.coins, mode:"PayTM"}));
        reset();
        //props.backDrop();
    };
    const prevOrders = profile.orders && profile.orders.map((order) => {
        return (
            <Grid item xs={12} sm={6} key={order.orderid}><Box boxShadow={2} justifyContent="center" alignItems="center" className={order.status === 'SUCCESS' ? `${classes.prevBox} ${classes.successBox}` : `${classes.prevBox} ${classes.pendingBox}`}>
                <Box display="flex" flexDirection="column" justifyContent="center" style={{width: '20%', textAlign: "center",}}><Box style={{ fontSize: 25, fontWeight: 'fontWeightBold'}}>₹{order.amt}</Box><Box fontSize={12}>{order.status === 'SUCCESS' ? `Success` : `Failure`}</Box></Box>
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" style={{width: '60%'}}>
                    <Box>{order.mode}</Box>
                    <Box>{order.date}</Box>
                    {order.status === 'FAILURE' ? <Box fontSize={10}>{order.respmsg}</Box> : null}
                </Box>
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" style={{width: '20%'}}>{order.status === 'SUCCESS' ? <CheckCircleOutlined style={{ fontSize: 35 }} /> : <HighlightOff style={{ fontSize: 35 }} />}</Box>
            </Box></Grid>
        )
    })

    return (
        <div className={classes.root}>
            <Container maxWidth="sm" className={classes.container}>
                <Grid item xs={12} id="buyCoins">
                    <form key={1} noValidate onSubmit={handleSubmit(onSubmitAddCoin)}>
                        <Card variant="outlined" id="buy-coins">
                            <CardHeader title="Buy Coins" subheader="Refill your Wallet"
                            action={
                                <IconButton aria-label="settings">
                                    <AccountBalanceWalletIcon color="inherit"/>
                                </IconButton>
                            }
                            />
                            <CardContent style={{textAlign: 'center'}}>
                                <Grid container direction="row" spacing={2} justify="center" alignItems="flex-start">
                                    <Grid item xs={12}>
                                        { (profile.wallet<2)
                                        ? <Typography className={classes.pos} paragraph color="error">
                                            You have only {profile.wallet} coin!<br/>You need 2 coins to enroll in any match.
                                            <br/>So, Buy atleast {profile.wallet===0 ? '2 coins' : '1 coin'}!
                                        </Typography>
                                        : null
                                        }
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box textAlign="center" fontSize={60} fontWeight="fontWeightMedium">₹
                                            <Box display="inline-block" fontSize={100} fontWeight="fontWeightBold">{(coins.coins)*unit}</Box>
                                        </Box>
                                        <Box fontSize={18}>{coins.coins<0 ? `0` : coins.coins} X {unit}</Box>
                                        <Box fontSize={14} fontWeight="fontWeightLight">1 Coin costs Rs.{unit}!</Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            variant="outlined" autoFocus
                                            style = {{width: '50%'}}
                                            margin="dense"
                                            required
                                            name="coins"
                                            id="coins"
                                            label="Enter No. of coins"
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
                                    </Grid>
                                </Grid>
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
                <Grid item xs={12}><Box fontSize="h6.fontSize" letterSpacing={1} textAlign="left" padding={2}>Purhase History</Box></Grid>
                <Grid container item xs={12} spacing={1} id="PrevOrders" justify="center" alignItems="flex-start">
                    {prevOrders}
                </Grid>
            </Container>
            <footer className={classes.footer}>
                <Copyright />
            </footer>
        </div>
    );
}