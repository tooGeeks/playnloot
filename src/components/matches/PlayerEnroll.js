import React from 'react'
import { makeStyles, Container, TextField, Typography, Button, Paper, Grid, Box, Divider } from '@material-ui/core';
import useForm from 'react-hook-form';
import { compose } from 'redux';
import { connect, useDispatch, useSelector } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { enterMatch } from '../../store/actions/MatchActions';
import { clearDialog } from '../../store/actions/uiActions'
import Copyright from '../layout/Copyright'
import { unit, rules } from '../../constants'


const useStyles = makeStyles(theme=>({
    root: {
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column',
        minHeight: '100vh',
    },
    container: {
        marginTop: theme.spacing(2)
    },
    submit: {
        margin: theme.spacing(1, 0, 0),
    },
    paper: {
        padding: theme.spacing(2),
        paddingTop : theme.spacing(2),
        backgroundColor: theme.palette.background.paper
    },
    footer: {
        marginTop: 'auto',
        marginBottom: theme.spacing(10)
    }
}))

const PlayerEnroll = (props) => {
    const classes = useStyles()
    const dispatch = useDispatch();
    dispatch(clearDialog()); //Clear Dialog
    const {Matches, profile} = props
    const match = Matches && Matches[0]
    const {register,errors,handleSubmit} = useForm()
    let enpdiv;
    const enroll = (data, e)=>{
        e.preventDefault();
        dispatch(enterMatch(match,data))

    }
    switch(match && match.mode){
        default:
            break;
        case "Duo":
            enpdiv = (
                <TextField
                id="mate1" variant='outlined' size="small"
                label="Enter your Teammate's PUBG ID"
                name="mate1"
                required
                fullWidth
                inputRef={register({
                  required: true
                })}
                error={!!errors["mate1"]}
                helperText="Please enter the EXACT PUBG ID"
                />
            )
            break
        case "Squad":
            enpdiv = ['1st','2nd','3rd'].map((mate,ind)=>{
                    return(
                        <React.Fragment key={ind}>
                            <TextField
                            variant='outlined' size="small"
                            id={"mate"+(parseInt(ind)+1)}
                            name={"mate"+(parseInt(ind)+1)}
                            label={mate+" Mate's PUBG ID"}
                            fullWidth
                            required
                            inputRef={register({
                              required: true
                            })}
                            error={!!errors["mate"+(parseInt(ind)+1)]}
                            /><br/><br/>
                        </React.Fragment>
                    )
            })
    }
    return (
        <div className={classes.root}>
            <Container className={classes.container} maxWidth="sm">
                <form noValidate onSubmit={handleSubmit(enroll)}>
                <Paper className={classes.paper}>
                    <Grid container item direction="row" justify="space-evenly" alignContent="space-around" spacing={1}>
                        <Grid item xs={12}>
                            <Typography component="h1" variant="h5" align="center">Enroll in {match && match.name}</Typography>
                            <br/>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box fontSize={16} textAlign="center">Match Date: {match && match.mdate}</Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box fontSize={16} textAlign="center" mb={2}>Match Time: {match && match.mtime}</Box>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField id="pubgid" variant='outlined'
                            style={{marginBottom: 10}}
                            label="Enter your PUBG ID"
                            name="pubgid"
                            required
                            fullWidth size="small"
                            inputRef={register({
                              required: true,
                              validate: {
                                  idmatch: value => value === profile.pubgid || ""
                              }
                            })}
                            error={!!errors.pubgid}
                            helperText={errors.pubgid ? errors.pubgid.type === 'required' ? "Enter your PUBG ID" : errors.pubgid.type === 'idmatch' ? "Wrong ID! Contact Admin" : false : "Confirm your EXACT PUBG ID!"}
                            />
                            {enpdiv}
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <Box letterSpacing={1} fontSize={18} textAlign="center">RULES</Box>
                            <Divider variant="middle"/>
                            <Box mt={0.5} p={1}>
                                {rules && rules.map((rule, ind) => {
                                    return (
                                    <Box key={ind} pl={1} pr={1} mb={1}>{`${ind+1}. ${rule}`}</Box>
                                    )
                                })}
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box fontSize={10} textAlign="center">*By clicking below, you agreed to all the rules</Box>
                            <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>Confirm Enrollment</Button>
                        </Grid>
                    </Grid>
                </Paper>
                </form>
            </Container>
            <footer className={classes.footer}>
                <Copyright />
            </footer>
        </div>
    )
}

const mapStatetoProps = (state)=>{
    return{
        profile: state.firebase.profile,
        Matches:state.firestore.ordered.Matches,
        Users:state.firestore.ordered.Users
    }
}

export default compose(
    connect(mapStatetoProps),
    firestoreConnect(props=>[
        {collection:"Matches",doc:props.match.params.mid},{collection:"Users",where:['matches','array-contains',props.match.params.mid]}
    ])
)(PlayerEnroll)