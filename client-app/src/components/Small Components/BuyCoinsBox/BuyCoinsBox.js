import React, { useState } from 'react'
import { makeStyles, Container, Grid, IconButton, TextField, CardHeader, Typography, Card, CardContent, CardActions, Button, Box } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { unit } from '../../../constants';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import { useForm } from 'react-hook-form';
import { createRazorPayDialog } from '../../../Functions';
import { creditWithRazor } from '../../../store/actions/PaymentActions';

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
        minHeight: '4rem',
        minWidth: '100%',
        borderRadius: 3,
        boxShadow: 2,
        display: 'flex',
        padding: 10,
        backgroundColor: theme.palette.background.paper,
    },
    failTxt: {
        color: theme.palette.error.dark,
    },
    pendingBox: { borderLeft: `4px solid ${theme.palette.error.dark}`, '&.selected $failTxt': {
        color: theme.palette.error.dark,
    }},
    sucTxt: {
        color: '#81c784'
    },
    successBox: { borderLeft: '4px solid #81c784' }
}));

export const BuyCoinsBox = ({amount,finalAction,prefill}) => {
    const { handleSubmit, register, errors } = useForm();
    const classes = useStyles();
    const defAmt = amount;
    const { profile, auth } = useSelector(state => state.firebase)
    const [ coins, setCoins ] = useState({coins:parseInt(defAmt/unit)});
    const dispatch = useDispatch();
    let rpayData = {};

    const handleChange = (e) => {
        setCoins({coins: e.target.value})
    }

    const hSubmit = () => {
        let fAction = (res) => {
            finalAction(res,rpayData);
        }
        createRazorPayDialog(parseInt(coins.coins)*unit,"Buy Coins",prefill,{},fAction).then(({resData,rzp}) => {
            rpayData = {...resData};
            rzp.open();
        })
    }

    return (
        <div>
        <Container maxWidth="sm" className={classes.container}>
                <Grid item xs={12} id="buyCoins">
                    <form key={1} noValidate onSubmit={handleSubmit(hSubmit)}>
                        <Card variant="outlined" id="buy-coins">
                            <CardHeader title="Buy Coins" style={{alignSelf:'center'}} subheader="Refill your Wallet" />
                            <CardContent style={{textAlign: 'center'}}>
                                <Grid container direction="row" spacing={2} justify="center">
                                    { (profile.wallet<2) ? <Grid item xs={12}>
                                        <Typography className={classes.pos} paragraph color="error">
                                            You have only {profile.wallet} coin!<br/>You need 2 coins to enroll in any match.
                                            <br/>So, Buy atleast {profile.wallet===0 ? '2 coins' : '1 coin'}!
                                        </Typography>
                                    </Grid> : null }
                                    <Grid item xs={12}>
                                        <Box textAlign="center" maxWidth="100vw" fontSize={30} fontWeight="fontWeightMedium">₹
                                            <Box display="inline-block" fontSize={50} fontWeight="fontWeightBold">{(coins.coins)*unit}</Box>
                                        </Box>
                                        <Box fontSize={16}>{coins.coins<0 ? `0` : coins.coins} X {unit}</Box>
                                        <Box fontSize={12} fontWeight="fontWeightLight">1 Coin costs Rs.{unit}!</Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            variant="outlined" 
                                            autoFocus
                                            margin="dense"
                                            required
                                            name="coins"
                                            id="coins"
                                            label="Enter No. of coins"
                                            type="number"
                                            onChange={handleChange}
                                            defaultValue={defAmt/unit}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            inputRef={
                                                register({
                                                    required: true,
                                                    min: defAmt/unit,
                                                    max: 200,
                                                })
                                            
                                            }
                                            error={!!errors.coins}
                                            helperText={(errors.coins ? (errors.coins.type === 'required' ? "Enter No. of Coins!" : (errors.coins.type === "min" ? "Coins must be greater than "+defAmt/unit : "Coins must be less than 200")) : null)}
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
            </Container>
        </div>
    )
}