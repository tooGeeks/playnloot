import React, { useEffect } from 'react'
import { makeStyles, Container, TextField, Typography, Button, Paper, Grid, Box, Divider, GridList, GridListTile } from '@material-ui/core';
import useForm from 'react-hook-form';
import { compose } from 'redux';
import { connect, useDispatch } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { enterMatch } from '../../store/actions/MatchActions';
import { backDrop, clearBackDrop } from '../../store/actions/uiActions'
import Copyright from '../layout/Copyright'
import { rules } from '../../constants'
import { convt, dateString } from '../../Functions'


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
    prizes: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        backgroundColor: theme.palette.background.paper,
    },
    rankBar: {
        padding: theme.spacing(2),
        marginLeft: theme.spacing(1.5),
        marginRight: theme.spacing(1),
        backgroundColor: theme.palette.custom.BlueBell,
        width: '2rem',
        textAlign: 'center',
        verticalAlign: 'center',
        writingMode: 'vertical-rl',
        textOrientation: 'sideways'
    },
    footer: {
        marginTop: 'auto',
        marginBottom: theme.spacing(10)
    }
}))

const PlayerEnroll = (props) => {
    const classes = useStyles()
    const dispatch = useDispatch();
    const {Matches, profile} = props
    const match = Matches && Matches[0]
    let enpdiv = false;

    useEffect(() => {
        if(match && match.mode.team && enpdiv) dispatch(clearBackDrop())
        else dispatch(backDrop())
    }, [match, enpdiv, dispatch])
    if(Matches && profile.matches && (profile.matches).includes(props.match.params.mid)) props.history.push('/dashboard');

    const {register, errors, handleSubmit, reset} = useForm()
    const enroll = (data, e)=>{
        e.preventDefault();
        dispatch(enterMatch(match,data))
        reset()
    }   
    switch(match && match.mode.team){
        default:
            break;
        case "Solo": enpdiv = true; break;
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
                        <Grid item xs={12} style={{paddingBottom: 20}}><Typography component="h1" variant="h5" align="center" color="primary">Enroll in {match && match.name}</Typography></Grid>
                        <Grid container item justify="space-between" xs={12}>
                            <Grid item xs={4} order={2}>
                                <Typography variant="body1">{match && dateString(match.mdate)}</Typography>
                                <Typography variant='caption'>Match Date</Typography>
                                <Typography variant="body1">{match && convt(1,match.mtime)}</Typography>
                                <Typography variant="caption">Match Time</Typography>
                                <Typography variant="body1">{match && dateString(match.lrdate)}</Typography>
                                <Typography variant="caption">Last Date</Typography>
                            </Grid>
                            <Grid item xs={6} className={classes.prizes} order={1}>
                                <Box className={classes.rankBar} style={{height: '100px'}}>1000</Box>
                                <Box className={classes.rankBar} style={{height: '75px'}}>500</Box>
                                <Box className={classes.rankBar} style={{height: '50px'}}>200</Box>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Box display="flex" justifyContent="center" alignItems="flex-end" mt={1} mb={1}>
                                <Box mr={2}>
                                    <Typography variant="h6">₹{match && match.prizes['1']}</Typography>
                                    <Typography variant="caption">1<sup>st</sup> Prize</Typography>
                                </Box>
                                <Box fontSize={14}>1<sup>st</sup> : ₹{match && match.prizes['1']}</Box><Box mr={2} fontSize={14}>2<sup>nd</sup> : ₹{match && match.prizes['2']}</Box><Box mr={2} fontSize={14}>3<sup>rd</sup> : ₹{match && match.prizes['3']}</Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <Typography align="center">Pros Follow these Rules</Typography>
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
                            <Typography variant="subtitle1">Fill to enroll now!</Typography>
                        </Grid>
                        <Grid item xs={12}>
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