import React from "react";
import { createMatch } from '../../store/actions/MatchActions';
import {connect} from 'react-redux';
import {firestoreConnect} from 'react-redux-firebase';
import {compose} from 'redux';
import {compdate,getCurrentDate} from '../../Functions';
import { Select, MenuItem, TextField, Divider, Button, Container, Grid, makeStyles, Typography, Icon } from "@material-ui/core";

import {useForm, useFieldArray, Controller} from "react-hook-form";
import { AddCircle, CloseSharp, RemoveCircle, DeleteForeverRounded } from "@material-ui/icons";
/*
  This Component is used to Create a New Match
*/

const useStyles = makeStyles(theme=>({
    root:{
        display:'flex',
        minHeight:'100vh'
    },
    container:{
        marginBottom:theme.spacing(9)
    },
    hText:{
        marginTop:theme.spacing(4),
        marginBottom:theme.spacing(2)
    }
}))

const CreateMatch = (props)=>{
    const classes = useStyles();
    const { register, handleSubmit, errors, control } = useForm({
        rules:[]
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name:'rules'
    }); 
    const [rCount,setRCount] = React.useState(0);
    const chkexistmatch = (data)=>{//checks if already a match is scheduled on specified date
        const {matches} = props;
        return matches.map(match =>{
            return(match.mtime===data.mtime)
        })
    }
    const onSubmit = (data,e)=>{
        e.preventDefault();
        console.log(data,e);
        const cds = getCurrentDate();
        const mdt = data.mdate;
        const ldt = data.lrdate;
        const mti = data.mtime
        const team = data.team
        const deftag = data.deftag
        const view = data.view
        const map = data.map
        if(mti===undefined){
            alert("Please Specify the Match Time")
            return;
        }
        if(team==='cao'){
            alert("Please Specify the Match Mode")
            return;
        }
        if(deftag==='cao'){
            alert("Please Specify the Match Platform")
            return;
        }
        if(view==='cao'){
            alert("Please Specify the Match Platform")
            return;
        }
        if(map==='cao'){
            alert("Please Specify the Match Platform")
            return;
        }
        if(compdate(cds,mdt) && compdate(ldt,mdt) && compdate(cds,ldt)){//checks that match date, last enrollment date and today's date are in order
            if(chkexistmatch(data).includes(true)){
                alert("Already A Match on Specified Date");
                return;
            }
            props.createMatch(data);
        }
        else{
            if(!compdate(cds,mdt)){
                window.alert("Tournament Date cannot before or be same as Today");
            }
            if(!compdate(ldt,mdt)){
                window.alert("Last Registration Date cannot be after or same as Tournament Date");
            }
            if(!compdate(cds,ldt)){
                window.alert("Last Registration Date cannot be before same as or Today");
            }
        }
    }
    const rulesDiv = []
    /**
    {
        return(
            <Grid item key={inx} xs={12}>
                <TextField
                    variant="outlined"
                    margin="normal"
                    id={rule}
                    name={rule}
                    type='text'
                    label={"Rule-"+(inx+1)}
                    fullWidth
                    inputRef={register({
                        required: true,
                    })}
                />
            </Grid>
        )
    }
    */
    return(
        <div className={classes.root}>
            <Container className={classes.container} maxWidth="md">
                <Typography variant='h5' className={classes.hText}>Create a New Match</Typography>
                <form noValidate onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                inputRef={register({
                                    required: true,
                                })}
                                fullWidth
                                id="name"
                                type="text"
                                label="Match Name"
                                name="name"
                                autoFocus
                                error={!!errors.name}
                                helperText={errors.name ? "Enter Match Name!" : null}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                inputRef={register({
                                    required: true,
                                    validate: { matchTime: (value)=> {
                                        props.matches.map(match => match.mtime===value)}
                                    },
                                })}
                                fullWidth
                                id="mdate"
                                type="date"
                                label="Match Date"
                                name="mdate"
                                defaultValue={getCurrentDate(2)}
                                error={!!errors.mdate}
                                helperText={(errors.mdate ? (errors.mdate.type === 'required' ? "Enter Match Date!" : "Invalid Date Format") : null)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                inputRef={register({
                                    required: true,
                                })}
                                fullWidth
                                id="mtime"
                                type="time"
                                label="Match Time"
                                name="mtime"
                                defaultValue={"00:00"}
                                error={!!errors.mdate}
                                helperText={(errors.mdate ? (errors.mtime.type === 'required' ? "Enter Match Time!" : "Invalid Time Format") : null)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                inputRef={register({
                                    required: true,
                                })}
                                fullWidth
                                id="lrdate"
                                type="date"
                                label="Last Registration Date"
                                name="lrdate"
                                defaultValue={getCurrentDate(1)}
                                error={!!errors.lrdate}
                                helperText={(errors.lrdate ? (errors.lrdate.type === 'required' ? "Enter Last Reg. Date!" : "Invalid Date Format") : null)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Controller name="team" defaultValue="cao" control={control} as={
                                <Select
                                id="team"
                                name="team"
                                label="Select Team Type"
                                inputRef={register({
                                    required: true,
                                })}
                                defaultValue="cao"
                                style={{width:'150px',color:"#ffffff"}}
                            >
                                <MenuItem key={""} innerRef={{name:"cao"}} name="cao" value={'cao'} disabled>Choose an Option</MenuItem>
                                {['Solo','Duo','Squad'].map(team=>(<MenuItem innerRef={{name:team}} name={team} key={team} value={team}>{team}</MenuItem>))}
                            </Select>
                            }/>
                            
                        </Grid>
                        <Grid item xs={6}>
                            <Controller 
                                name="view"
                                defaultValue="cao"
                                control={control}
                                as={<Select
                                inputRef={register({
                                    required: true,
                                })}
                                name="view"
                                id="view"
                                label="Select Perspective"
                                defaultValue="cao"
                                style={{width:'150px',color:"#ffffff"}}
                            >
                                <MenuItem key={""} innerRef={{name:"cao"}} name="cao" value={'cao'} disabled>Choose an Option</MenuItem>
                                {['TPP','FPP'].map(view=>(<MenuItem key={view} name={view} innerRef={{name:view}} value={view}>{view}</MenuItem>))}
                            </Select>}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Controller
                                name="map"
                                defaultValue="cao"
                                control={control}
                                as={<Select
                                inputRef={register({
                                    required: true,
                                })}
                                name="map"
                                id="map"
                                label="Select Map"
                                defaultValue="cao"
                                style={{width:'150px',color:"#ffffff"}}
                            >
                                <MenuItem key={"cao"} innerRef={{name:"cao"}} name="cao" value={'cao'} disabled>Choose an Option</MenuItem>
                                {['Erangel','Miramar','Sanhok','Vikendi'].map(map=>(<MenuItem innerRef={{name:map}} name={map} key={map} value={map}>{map}</MenuItem>))}
                            </Select>}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Controller
                                name="deftag"
                                defaultValue="cao"
                                control={control}
                                as={<Select
                                label="Select Platform"
                                name="deftag"
                                id="deftag"
                                inputRef={register({
                                    required: true,
                                })}
                                defaultValue="cao"
                                style={{width:'150px',color:"#ffffff",position:'relative'}}
                            >
                                <MenuItem key={"cao"}  name="cao" value={'cao'} disabled>Choose an Option</MenuItem>
                                {['mobile','emu'].map(deftag=>(<MenuItem name={deftag} innerRef={{name:deftag}} key={deftag} value={deftag}>{deftag}</MenuItem>))}
                            </Select>}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                inputRef={register}
                                id="tags"
                                type="text"
                                label="Tags"
                                name="tags"
                                error={!!errors.tags}
                                helperText={(errors.tags ? (errors.tags.type === 'required' ? "Enter Last Reg. Date!" : "Invalid Date Format") : null)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                id="fee"
                                inputRef={register({
                                    required: true,
                                })}
                                defaultValue={0}
                                type="number"
                                label="Fee"
                                name="fee"
                                error={!!errors.fee}
                                helperText={(errors.fee ? (errors.fee.type === 'required' ? "Enter Fee!" : "Invalid Date Format") : null)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                            variant="outlined"
                                margin="normal"
                                id="bKills"
                                inputRef={register({
                                    required: true,
                                })}
                                defaultValue={0}
                                type="number"
                                label="Coins Per Kill"
                                name="bKills"
                                error={!!errors.bKills}
                                helperText={(errors.kills ? (errors.bKills.type === 'required' ? "Enter Coins Per Kill!" : "Invalid Date Format") : null)}
                            />
                        </Grid>
                        <Divider/>
                        {["1st","2nd","3rd"].map((pn,ind)=>{
                                    return(
                                        <Grid key={ind} item xs={4} >
                                            <TextField
                                                variant="outlined"
                                                margin="normal"
                                                inputRef={register}
                                                id={"prize-"+(ind+1)}
                                                type="number"
                                                label={pn+" Prize"}
                                                name={"prize-"+(ind+1)}
                                                error={!!errors[pn]}
                                                helperText={(errors[pn] ? (errors[pn].type === 'required' ? "Enter Fee!" : "Invalid Date Format") : null)}
                                            />
                                        </Grid>
                                    )
                                })
                        }
                        {fields.map((item,inx)=>(
                            <React.Fragment key={item.id}>
                                <Grid item xs={10}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    id={'rule-'+inx}
                                    name={'rule-'+inx}
                                    type='text'
                                    label={"Rule "+(inx)}
                                    fullWidth
                                    defaultValue={item.name}
                                    inputRef={register({
                                        required: true,
                                    })}
                                />
                                </Grid>
                                <Grid item xs={2}>
                                    <Button variant='text' color='default' size='small' style={{marginTop:'3vh',borderSpacing:'-1'}}
                                    onClick={()=>remove(inx)}>
                                        <Icon><DeleteForeverRounded/></Icon>
                                    </Button>
                                </Grid>
                            </React.Fragment>
                        ))}
                        <Grid item xs={5}>
                            <Button variant='text' color='primary' onClick={()=>{append({name:'rules'})}}>
                                <Icon style={{marginRight:'1vh'}}><AddCircle/></Icon> Add Rule
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                style={{marginTop:"1%",marginBottom:"2%"}}
                            >Create Match
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Container>
        </div>
    )
}

const mapDispatchtoProps = (dispatch) =>{
    return{
        createMatch : (match)=>dispatch(createMatch(match))

    }
}
const mapStatetoProps = (state)=>{
    return{
        auth:state.firebase.auth,
        matches:state.firestore.ordered.Matches,
        profile:state.firebase.profile
    }
}

export default compose(
    connect(mapStatetoProps,mapDispatchtoProps),
    firestoreConnect((props)=>[
        {collection:'Matches'}
    ])
)(CreateMatch);