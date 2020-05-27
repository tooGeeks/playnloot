import React, { useEffect } from 'react'
import { makeStyles, Container, TextField, Typography, Button, Paper, Grid, Box, Divider, GridList, GridListTile, SvgIcon, Badge, Tooltip } from '@material-ui/core';
import useForm from 'react-hook-form';
import { compose } from 'redux';
import { connect, useDispatch } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { enterMatch } from '../../store/actions/MatchActions';
import { backDrop, clearBackDrop } from '../../store/actions/uiActions'
import Copyright from '../layout/Copyright'
import { rules } from '../../constants'
import { convt, dateString } from '../../Functions'
import Emoji from '../Emoji'
import mSolo from '../imgs/mSolo.png'
import mDuo from '../imgs/mDuo.png'
import mSquad from '../imgs/mSquad.png'
import { AccessTime, Today, EventBusy, CheckCircle, DirectionsRun } from '@material-ui/icons';
import Trophy from '../imgs/trophy.svg'


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
        padding: theme.spacing(3),
        marginTop: 0,
    },
    prizes: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        backgroundColor: theme.palette.background.paper,
    },
    detailsBox: {
        marginTop: theme.spacing(2),
        textAlign: 'center'
    },
    hostRules: {
        marginTop: 10,
        marginBottom: 10,
        padding: 5,
    },
    enrollPaper: {
        padding: theme.spacing(2),
        backgroundColor: theme.palette.background.default
    },
    enrollPaperLabel: {
        paddingBottom: theme.spacing(2)
    },
    enrollPaperRuleLine: {
        marginTop: 10
    },
    footer: {
        marginTop: 'auto',
        marginBottom: theme.spacing(10)
    }
}))

const Match = (props) => {
    const classes = useStyles()
    const dispatch = useDispatch();
    const {Matches, profile} = props
    const match = Matches && Matches[0]
    let enpdiv = false;
    let topImg;

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
    const positions = ["", "st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th", "th"]
    
    switch(match && match.mode.team){
        default:
            break;
        case "Solo": 
            topImg = (
                <img src={mSolo} width="100%" alt="playnloot Solo Match" style={{top: 'auto', bottom: 0}}/>
            )
            enpdiv = <></>; 
            break;
        case "Duo":
            topImg = (
                <img src={mDuo} width="100%" alt="playnloot Duo Match" style={{top: 'auto', bottom: 0}} />
            )
            enpdiv = <React.Fragment>
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
            </React.Fragment>
            break;
        case "Squad":
            topImg = (
                <img src={mSquad} width="100%" alt="playnloot Squad Match" style={{top: 'auto', bottom: 0}} />
            )
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
                <Grid container spacing={0} style={{paddingBottom: 0}}>
                    <Grid item xs={6}>
                        <Box display='flex' flexDirection='row' height="100%" alignContent='flex-end' alignItems='flex-end'><Box mb={-1}>{topImg}</Box></Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="flex" flexDirection="column" justifyContent="space-around" p={1} height="100%">
                            <Box><Typography component='h1' variant='h5' color='secondary' align='center' style={{marginBottom: 4}}>{match && match.name}</Typography></Box>
                            <Box textAlign="right" fontSize={14}>{match && match.mode.team}</Box>
                            <Box textAlign="right" fontSize={16} fontWeight="fontWeightMedium"><Emoji symbol="💸" label="entry fees" />{match && match.fee !== 0 ? `₹${match.fee}` : "Free"}</Box>
                            <Box textAlign="right" fontSize={16}><Emoji symbol="🤑" label="prizepool" />Prizes ₹</Box>
                            <Box mt={1} display="flex" justifyContent="flex-end">
                            <Tooltip enterTouchDelay={10} title={match && match.isTrusted ? "Trusted Host" : "Hosted by a Player"} arrow><Box mt={0}  alignItems="center" fontSize={16}>
                                {match && match.host}&nbsp;{match && match.isTrusted ? <CheckCircle style={{fontSize: 16}}/> : null}
                            </Box></Tooltip>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
                <Paper className={classes.paper}>
                    <Grid container item direction="row" justify="space-evenly" alignContent="space-around" spacing={1}>
                        <Grid container item xs={12} justify="space-around" alignContent="space-between" style={{marginBottom: 10}}>
                            <Grid item>
                                <Box textAlign="center">
                                    <Today/><Typography variant="body1">{match && dateString(match.mdate)}</Typography>
                                    <Typography variant='caption'>Match Date</Typography>
                                </Box>
                            </Grid>
                            <Grid item><Box textAlign='center'>
                                <AccessTime />
                                <Typography variant="body1">{match && convt(1,match.mtime)}</Typography>
                                <Typography variant="caption">Match Time</Typography>
                            </Box></Grid>
                            <Grid item><Box textAlign="center">
                                <EventBusy />
                                <Typography variant="body1">{match && dateString(match.lrdate)}</Typography>
                                <Typography variant="caption">Last Date</Typography>
                            </Box></Grid>
                        </Grid>
                        <Grid item xs={6} style={{marginTop: 2, marginBottom: 2, borderRight: '1px solid rgb(255,255,255, 0.3)'}}>
                        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" mt={1} mb={1}>
                        <Typography component="h6" variant="body1" color="initial" align="center">Loot</Typography>
                            {match && match.survival && Object.keys(match.survival).map((key) => {
                                return (
                                    <Box key={key} display="flex" flexDirection="row" mt={2} alignItems="flex-end">
                                        <Box mr={1}>
                                            {/* <Badge color="secondary" badgeContent={key}> */}
                                                <img src={Trophy} width="36px"/>
                                            {/* </Badge> */}
                                        </Box>
                                        <Box>
                                            <Box fontSize={16}>₹{match && match.survival[key]}</Box>
                                            <Typography variant="caption">{key}<sup>{positions[key]}</sup> Prize</Typography>
                                        </Box>
                                    </Box>
                                )
                            })}
                            {match && match.kills ? <>
                                <Box mt={2} fontSize={14}>And</Box>
                                <Box display="flex" flexDirection="row" mt={1} alignItems="flex-end">
                                    <Box><DirectionsRun fontSize="large" /></Box>
                                    <Box>
                                        <Box fontSize={16}>₹{match.kills}</Box>
                                        <Typography variant="caption">Per Kill</Typography>
                                    </Box>
                                </Box>
                            </> : null}
                        </Box>
                        </Grid>
                        <Grid item xs={6} style={{marginTop: 2, marginBottom: 2}}>
                        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" mt={1} mb={1}>
                            <Typography component="h6" variant="body1" color="initial" align="center">Details</Typography>
                            
                            <Box className={classes.detailsBox}>
                                <Typography variant="body1">{match && match.mode.map}</Typography>
                                <Typography variant="caption">Map</Typography>
                            </Box>
                            <Box className={classes.detailsBox}>
                                <Typography variant="body1">{match && match.mode.view}</Typography>
                                <Typography variant="caption">View</Typography>
                            </Box>
                            <Box className={classes.detailsBox}>
                                <Typography variant="body1">{match && match.plno}/100</Typography>
                                <Typography variant="caption">Enrolled PLayers</Typography>
                            </Box>
                        </Box>
                        </Grid>
                        {match && match.customRules ? <Grid item xs={12} className={classes.hostRules}>
                            <Typography align="center" variant="subtitle2">Additional Host Rules</Typography>
                            <Divider variant="middle"/>
                            <Box m={0} p={1}>
                                {match && match.customRules && match.customRules.map((rule, ind) => {
                                    return (
                                    <Box key={ind} pl={1} pr={1} mb={1}>{`${ind+1}. ${rule}`}</Box>
                                    )
                                })}
                            </Box>
                        </Grid> : null }
                        <Grid item xs={12}>
                            <Paper className={classes.enrollPaper}>
                                <Typography variant="subtitle2" align="center" className={classes.enrollPaperLabel}>ENROLL NOW</Typography>
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
                                {enpdiv ? enpdiv : null}
                                <Box fontSize={12} textAlign="center" className={classes.enrollPaperRuleLine}>*By clicking below, you agreed to all the <Typography component="span" variant="button" color="initial" onClick={() => props.history.push('/#rules')}>rules</Typography></Box>
                                <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>Confirm Enrollment</Button>
                            </Paper>
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
)(Match)