import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { creditWallet, } from '../../../store/actions/PaymentActions';
import useForm from "react-hook-form";
import { makeStyles, Container, Grid, Paper, IconButton, TextField, CardHeader, Typography, Card, CardContent, CardActions, Button } from '@material-ui/core';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import { showSnackbar } from '../../../store/actions/uiActions'
import Copyright from '../../layout/Copyright'


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
        return () => {
            
        }
    }, [profile, use, mny, dispatch])
    const [ coins, setCoins ] = useState({coins:0});
    
    const handleChange = (e) => {
        setCoins({coins: e.target.value})
    }
    const onSubmitAddCoin = (data, e) => {
        e.preventDefault();
        dispatch(creditWallet({noofcns:coins.coins,mode:"PayTM"}));
        reset();
        //props.backDrop();
    };

    return (
        <div className={classes.root}>
            <Container maxWidth="sm" className={classes.container}>
                <Grid item justify="center" alignItems="stretch" spacing={2} className={classes.grid}>
                    <Grid item xs={12} id="buyCoins">
                    <form key={1} noValidate onSubmit={handleSubmit(onSubmitAddCoin)}>
                        <Card variant="outlined" id="buy-coins">
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
                </Grid>
            </Container>
            <footer className={classes.footer}>
                <Copyright />
            </footer>
        </div>
    );
}