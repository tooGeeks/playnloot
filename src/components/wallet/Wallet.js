import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { creditWallet } from '../../store/actions/PaymentActions';
import { Redirect } from 'react-router-dom';
import useForm from "react-hook-form";
import { makeStyles, Container, Grid, Paper, IconButton, TextField, CardHeader, Typography, Card, CardContent, CardActions, Button } from '@material-ui/core';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';


const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
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

export default function Wallet() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { register, handleSubmit, errors } = useForm();
    const { profile, auth } = useSelector(
        state => state.firebase
    )
    const [coins,setCoins] = useState({coins:0});

    if (!auth.uid) return <Redirect to='/signin' />
    
    const handleChange = (e) => {
        setCoins({coins: e.target.value})
    }
    const onSubmit = (data, e) => {
        e.preventDefault();
        console.log(coins.coins);
        dispatch(creditWallet(coins.coins));
        //props.backDrop();
    };

    return (
        <React.Fragment>
            <Container className={classes.root}>
                <Grid container 
                    direction="column" justify="center" alignItems="stretch" spacing={2} className={classes.grid}>
                    
                    <Grid item xs={12}>
                    <form noValidate onSubmit={handleSubmit(onSubmit)}>
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
                                1 Coin costs Rs.5!
                                </Typography>
                                    <TextField
                                        variant="filled"
                                        style = {{width: 95}}
                                        size="small"
                                        margin="dense"
                                        autoFocus
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
                                    Total: [{coins.coins}] x 5 = ₹{(coins.coins)*5}
                                </Typography>
                            </Paper>
                                    

                            </CardContent>
                            <CardActions>
                                    <Button type="submit" className={classes.buy} style={{width: 120}} 
                                        variant="contained" 
                                        color="primary" disabled={((coins.coins)<=0)}>
                                            Pay {((coins.coins)>0) ? ('₹' + (coins.coins)*5) : null}
                                    </Button>
                            </CardActions>
                        </Card>
                        </form>
                    </Grid>
                    <Grid item xs={12}>

                    </Grid>
                </Grid>
            </Container>
        </React.Fragment>
    );
}