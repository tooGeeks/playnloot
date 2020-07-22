<<<<<<< HEAD
import React from 'react';
import { Select, IconButton, MenuItem, TextField, Divider, Button, Container, Grid, makeStyles, Typography, Icon, MobileStepper, Switch, CardActions, CardContent, Card  } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit'
import { red } from '@material-ui/core/colors';
import {getInputDateTime, getPrizeNames} from '../../Functions'
import moment from 'moment'
import { Controller, useForm, useFieldArray } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { showDialog, clearDialog } from '../../store/actions/uiActions';
import { DeleteForeverRounded, AddCircle } from '@material-ui/icons';
/*
  This Component is used to Display the Details of a Match.
  It is like a template which can be used for any list of matches with details
*/

const useStyles = makeStyles({
    root:{
        minWidth:"90%",
        marginBottom:"15px"
    }
})

const EditModePrize = ({id,match,handleChange}) => {
    let nFields;
    console.log(match);
    let survival = [];
    for (const rank in match.survival) {
        survival.push(match.survival[rank]);
    }
    const { register, handleSubmit, errors, control, reset } = useForm({
        defaultValues:{survival}
    });
    const {fields:fieldsPrize, append:appendPrize, remove:removePrize} = useFieldArray({
        control,
        name:"survival"
    })
    switch(id){
        case 'mode':
            nFields = <React.Fragment>
                <Grid item xs={12}>
                    <Select
                        id="team"
                        name="team"
                        onChange={handleChange}
                        defaultValue={match.team}
                        fullWidth
                        label="Select Team Type"
                        style={{color:"#ffffff"}}
                    >
                        {['Solo','Duo','Squad'].map(team=>(<MenuItem innerRef={{name:team}} name={team} key={team} value={team}>{team}</MenuItem>))}
                    </Select>
                </Grid>
                <Grid item xs={12}>
                    <Select
                        name="view"
                        id="view"
                        onChange={handleChange}
                        defaultValue={match.view}
                        fullWidth
                        label="Select Perspective"
                        style={{color:"#ffffff"}}
                    >
                        {['TPP','FPP'].map(view=>(<MenuItem key={view} name={view} innerRef={{name:view}} value={view}>{view}</MenuItem>))}
                    </Select>
                </Grid>
                <Grid item xs={12}>
                    <Select
                        name="map"
                        defaultValue={match.map}
                        id="map"
                        onChange={handleChange}
                        fullWidth
                        label="Select Map"
                        style={{color:"#ffffff"}}
                    >
                        <MenuItem key={"cao"} innerRef={{name:"cao"}} name="cao" value={'cao'} disabled>Choose an Option</MenuItem>
                        {['Erangel','Miramar','Sanhok','Vikendi'].map(map=>(<MenuItem innerRef={{name:map}} name={map} key={map} value={map}>{map}</MenuItem>))}
                    </Select>
                </Grid>
                <Grid item xs={12}>
                    <Select
                        label="Select Platform"
                        name="deftag"
                        onChange={handleChange}
                        defaultValue={match.tags[0]}
                        fullWidth
                        id="deftag"
                        style={{color:"#ffffff",position:'relative'}}
                    >
                        {['mobile','emu'].map(deftag=>(<MenuItem name={deftag} innerRef={{name:deftag}} key={deftag} value={deftag}>{deftag}</MenuItem>))}
                    </Select>
                </Grid>
            </React.Fragment>
            break;
        case 'prize-pool':
            nFields = <React.Fragment>
                {fieldsPrize.map((item,ind)=>(
                <React.Fragment key={ind}>
                    <Grid item xs={4}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            inputRef={register({
                                required:true
                            })}
                            id={"survival["+(ind)+"]"}
                            type="number"
                            defaultValue={survival[ind]}
                            label={getPrizeNames(ind+1)+" Prize"}
                            name={"survival["+(ind)+"]"}
                            error={errors.survival && !!errors.survival[ind]}
                            helperText={(errors.survival && errors.survival[ind] ? (errors.survival[ind].type === 'required' ? "Enter "+getPrizeNames(ind+1)+" Prize!" : "Invalid Date Format") : null)}
                        />
                        </Grid>
                        <Grid item xs={2}>
                        <Button variant='text' color='default' size='small' style={{marginTop:'3vh',borderSpacing:'-1'}}
                        onClick={()=>removePrize(ind)}>
                            <Icon><DeleteForeverRounded/></Icon>
                        </Button>
                    </Grid>
                </React.Fragment>))}
                <Grid item xs={7}>
                    <Button variant='text' color='primary' onClick={()=>{appendPrize()}}>
                        <Icon style={{marginRight:'1vh'}}><AddCircle/></Icon> Add Prize
                    </Button>
                </Grid>
            </React.Fragment>
            break;
    }
    return(
    <Container>
        <Grid container spacing={2}>
                {nFields}
            </Grid>
    </Container>
    )
}

const MatchSummary = (props)=>{
    const classes = useStyles();
    const dispatch = useDispatch();
    const {match,bttnname,bttnname2,isCan,handleClick,handleClick2,isEditable,updatefunc} = props;//Passed By Calling Component
    const {team, map, view, survival} = match
   //const canEnroll = match.plno<parseInt(maxp) ? true : false;//Checks if match is full?
    const link = !isCan && handleClick ? handleClick : ()=>{} ;// Sets the button link to be the match if cannot enroll sets to current path
    const link2 = !isCan && handleClick2 ? handleClick2 : ()=>{} ;// Sets the button link to be the match if cannot enroll sets to current path
    //const canEnrollmsg = canEnroll ? null : <div><Typography color="red"><b>Match is Full</b></Typography></div> ; //Displays a message if Match is Full
    //const isEnrolledmsg = isEnr ? <div><Typography color={red[500]}><b>Already Enrolled</b></Typography></div> : null ;  // Displays a Message if Already Enrolled
    //const fmsg = isEnr ? isEnrolledmsg : canEnrollmsg; //Final message depending upon enrollment status
    const [updFields,setUpdFields] = React.useState({});
    const [hasUpdate,setHasUpdate] = React.useState(false);
    const canmsg = match.isActive ? "" : <Grid item xs={12}><Typography color={red[500]}>Match has been canceled</Typography></Grid>
    const bttn2 = bttnname2 && handleClick2 ? <Button color="primary" variant="contained" hidden id={match.id} onClick={()=>{link2(match.id)}} disabled={!match.isActive}>{bttnname2}</Button> : ""
    const updatebttn = isEditable ? <Button color="primary" variant="contained" onClick={()=>{updatefunc(match.id,updFields)}} disabled={!hasUpdate}>Update Match</Button> : ""
    const labels = {
        fee:'Entry Fee',
        date:'Match Date',
        lrdate:'L.Reg Date',
        time:'Match Time',
        mode:'Match Mode Details'
    }
    const [Fields,setFields] = React.useState({
        fee:<Typography>{labels.fee} : {match.fee}</Typography>,
        date:<Typography>Match Date : {moment(match.date.toDate()).calendar()}</Typography>,
        lrdate:<Typography>L.Reg Date : {moment(match.lrdate.toDate()).calendar()}</Typography>,
        time:<Typography>Match Time : {moment(match.date.toDate()).format("LT")}</Typography>,
        mode:<Typography>Match Mode Details : {team+"-"+view+"-"+map}</Typography>
    })
    const editField = id => {
        if(!hasUpdate) setHasUpdate(true)
        if(id === 'mode' || id === 'prize-pool'){
            let udata = {}
            let handleChange = (e) => {
                udata[e.target.name] = e.target.value;
            }
            
            let handleClick = (e) => {
                console.log(udata);
                dispatch(clearDialog());
            }
            const dialogAction = <Button onClick={handleClick} color='primary'>Done</Button>
            dispatch(showDialog({title:"Modes",content:<EditModePrize id={id} handleChange={handleChange} match={match} />,actions:dialogAction}));
            
        }else{
            let typ,defVal;
            switch(id){
                case 'fee':
                    typ = 'number'
                    defVal = match[id]
                    break;
                case 'lrdate': 
                    typ = 'date'
                    defVal = getInputDateTime(0,match.lrdate.toDate());
                    break;
                default:
                    typ = id
                    if(id === 'date') defVal = getInputDateTime(0,match.date.toDate());
                    else if(id === 'time') defVal = getInputDateTime(1,match.date.toDate());
            }
            updFields[id] = '';
            let fd = <TextField onChange={hChange} label={labels[id]} defaultValue={defVal} id={id+'-input'} type={typ} />
            setFields(prevx=>({...prevx,[id]:fd}))
            console.log(Fields)
        }
    }
    const hChange = (e) => {
        e.persist()
        let id = e.target.id.split('-')[0];
        console.log(e.target.value)
        if(e.target.type === 'number')  setUpdFields(prv => ({...prv,[id]:parseInt(e.target.value)}));
        else setUpdFields(prv => ({...prv,[id]:e.target.value}));
    }
    const cardActions = bttnname || bttnname2 ? (
        <CardActions>
            {isEditable ? updatebttn : null}
            <Button color="primary" variant="contained" id={match.id} onClick={()=>{link(match.id)}} disabled={!match.isActive}>{bttnname?bttnname:""}</Button>
            {bttn2}
        </CardActions>
    ) : null;
    return(
        <Card className={classes.root}>
            <CardContent>
                <Typography variant="h5">Match Name : {match.name}</Typography><br/>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Typography>Match ID : {match.id}</Typography>
                    </Grid>
                    <Grid item xs={10}>
                        {Fields.fee}
                    </Grid>
                    <Grid item xs={2}>
                        <IconButton onClick={() => editField('fee')}  size='medium' aria-label='Edit'><Icon><EditIcon/></Icon></IconButton>
                    </Grid>
                    <Grid item xs={10}>
                        {Fields.date}
                    </Grid>
                    <Grid item xs={2}>
                        <IconButton onClick={() => editField('date')} color='default' size='medium' aria-label='Edit'><Icon><EditIcon/></Icon></IconButton>
                    </Grid>
                    <Grid item xs={10}>
                        {Fields.lrdate}
                    </Grid>
                    <Grid item xs={2}>
                        <IconButton onClick={() => editField('lrdate')} color='default' size='medium' aria-label='Edit'><Icon><EditIcon/></Icon></IconButton>
                    </Grid>
                    <Grid item xs={10}>
                        {Fields.time /* Converts Time */}
                    </Grid>
                    <Grid item xs={2}>
                        <IconButton onClick={() => editField('time')} color='default' size='medium' aria-label='Edit'><Icon><EditIcon/></Icon></IconButton>
                    </Grid>
                    <Grid item xs={10}>
                        {Fields.mode}
                    </Grid>
                    <Grid item xs={2}>
                        <IconButton onClick={() => editField('mode')} color='default' size='medium' aria-label='Edit'><Icon><EditIcon/></Icon></IconButton>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography>Players Enrolled : {match.plno}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography hidden={!match.bKills}>Coin Per Kill : {match.bKills}</Typography>
                    </Grid>
                    <Grid item xs={10}>
                        <Typography hidden={!survival}>Prize Pool : {survival ? "1st : "+survival['1']+", 2nd : "+survival['2']+", 3rd : "+survival['3'] : null}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <IconButton onClick={() => editField('prize-pool')} color='default' size='medium' aria-label='Edit'><Icon><EditIcon/></Icon></IconButton>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography>Room ID : {match && match.roomid ? match.roomid : "Not Set" }</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography>Room Password : {match && match.roompass ? match.roompass : "Not Set" }</Typography>
                    </Grid>
                </Grid>
                {canmsg}
            </CardContent>
            {cardActions}
        </Card>
    )
}

=======
import React from 'react';
import { Typography, makeStyles, Card, CardContent, CardActions, Button } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import moment from 'moment'
/*
  This Component is used to Display the Details of a Match.
  It is like a template which can be used for any list of matches with details
*/

const useStyles = makeStyles({
    root:{
        minWidth:"90%",
        marginBottom:"15px"
    }
})

const MatchSummary = (props)=>{
    const classes = useStyles();
    const {match,bttnname,bttnname2,isCan,handleClick,handleClick2} = props;//Passed By Calling Component
   //const canEnroll = match.plno<parseInt(maxp) ? true : false;//Checks if match is full?
    const link = !isCan && handleClick ? handleClick : ()=>{} ;// Sets the button link to be the match if cannot enroll sets to current path
    const link2 = !isCan && handleClick2 ? handleClick2 : ()=>{} ;// Sets the button link to be the match if cannot enroll sets to current path
    //const canEnrollmsg = canEnroll ? null : <div><Typography color="red"><b>Match is Full</b></Typography></div> ; //Displays a message if Match is Full
    //const isEnrolledmsg = isEnr ? <div><Typography color={red[500]}><b>Already Enrolled</b></Typography></div> : null ;  // Displays a Message if Already Enrolled
    //const fmsg = isEnr ? isEnrolledmsg : canEnrollmsg; //Final message depending upon enrollment status
    const canmsg = match.isActive ? "" : <Typography color={red[500]}>Match has been canceled</Typography>
    const bttn2 = bttnname2 && handleClick2 ? <Button color="primary" variant="contained" hidden id={match.id} onClick={()=>{link2(match.id)}} disabled={!match.isActive}>{bttnname2}</Button> : ""
    const cardActions = bttnname || bttnname2 ? (
        <CardActions>
            <Button color="primary" variant="contained" id={match.id} onClick={()=>{link(match.id)}} disabled={!match.isActive}>{bttnname?bttnname:""}</Button>
            {bttn2}
        </CardActions>
    ) : null;
    const {team, map, view, survival} = match
    return(
        <Card className={classes.root}>
            <CardContent>
                <Typography variant="h5">Match Name : {match.name}</Typography><br/>
                <Typography>Match ID : {match.id}</Typography>
                <Typography>Entry Fee : {match.fee}</Typography>
                <Typography>Match Date : {moment(match.date.toDate()).calendar()}</Typography>
                <Typography>L.Reg Date : {moment(match.lrdate.toDate()).calendar()}</Typography>
                <Typography>Match Time : {moment(match.date.toDate()).format("LT")}</Typography>{/* Converts Time */}
                <Typography>Match Mode Details : {team+"-"+view+"-"+map}</Typography>
                <Typography>Players Enrolled : {match.plno}</Typography>
                <Typography hidden={!match.bKills}>Coin Per Kill : {match.bKills}</Typography>
                <Typography hidden={!survival}>Prize Pool : {survival ? "1st : "+survival['1']+", 2nd : "+survival['2']+", 3rd : "+survival['3'] : null}</Typography>
                <Typography>Room ID : {match && match.roomid ? match.roomid : "Not Set" }</Typography>
                <Typography>Room Password : {match && match.roompass ? match.roompass : "Not Set" }</Typography>
                {canmsg}
            </CardContent>
            {cardActions}
        </Card>
    )
}

>>>>>>> 07eee80aa2af5dfed2f3937a2ed87f18d16f5e6f
export default MatchSummary;