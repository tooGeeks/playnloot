import React from "react";
import { createMatch } from '../../store/Actions/MatchActions';
import {connect} from 'react-redux';
import {firestoreConnect} from 'react-redux-firebase';
import {compose} from 'redux';
import {compdate,getCurrentDate} from '../../Functions';
import { Select, MenuItem, TextField, Divider, Button, Container } from "@material-ui/core";

import {useForm} from "react-hook-form";
/*
  This Component is used to Create a New Match
*/

const CreateMatch = (props)=>{
    const { register, handleSubmit, errors } = useForm();
    const [state,setState] = React.useState({
        name:'',
        mdate:'',
        mtime:'',
        lrdate:'',
        team: 'cao',
        deftag:'cao',
        tags:'',
        fee:2,
        map:'cao',
        view:'cao',
        "prize-1":0,
        "prize-2":0,
        "prize-3":0
    })
    const chkexistmatch = ()=>{//checks if already a match is scheduled on specified date
        const {matches} = props;
        return matches.map(match =>{
            return(match.mtime===state.mtime)
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
            if(chkexistmatch().includes(true)){
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
    return(
        <React.Fragment>
            <Container maxWidth="md">
                <form noValidate onSubmit={handleSubmit(onSubmit)}>
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
                    <Select
                        id="team"
                        label="Select Team Type"
                        name="team"
                        inputRef={register({
                            required: true,
                        })}
                        defaultValue='cao'
                        style={{width:'150px',color:"#ffffff"}}
                    >
                        <MenuItem key={""} innerRef={{name:"cao"}} name="cao" value={'cao'} disabled>Choose an Option</MenuItem>
                        {['Solo','Duo','Squad'].map(team=>(<MenuItem name={team} key={team} value={team}>{team}</MenuItem>))}
                    </Select>
                    <Select
                        inputRef={register({
                            required: true,
                        })}
                        name='view'
                        id='view'
                        label="Select Perspective"
                        defaultValue='cao'
                        style={{width:'150px',color:"#ffffff"}}
                    >
                        <MenuItem key={""} innerRef={{name:"cao"}} name="cao" value={'cao'} disabled>Choose an Option</MenuItem>
                        {['TPP','FPP'].map(view=>(<MenuItem key={view} value={view}>{view}</MenuItem>))}
                    </Select>
                    <Select
                        inputRef={register({
                            required: true,
                        })}
                        name='map'
                        id='map'
                        label="Select Map"
                        defaultValue='cao'
                        style={{width:'150px',color:"#ffffff"}}
                    >
                        <MenuItem key={""} innerRef={{name:"cao"}} name="cao" value={'cao'} disabled>Choose an Option</MenuItem>
                        {['Erangel','Miramar','Sanhok','Vikendi'].map(map=>(<MenuItem name={map} key={map} value={map}>{map}</MenuItem>))}
                    </Select>
                    <Select
                        label="Select Platform"
                        name='deftag'
                        id='deftag'
                        inputRef={register({
                            required: true,
                        })}
                        defaultValue='cao'
                        style={{width:'150px',color:"#ffffff",position:'relative'}}
                    >
                        <MenuItem key={""}  name="cao" value={'cao'} disabled>Choose an Option</MenuItem>
                        {['mobile','emu'].map(deftag=>(<MenuItem name={deftag} key={deftag} value={deftag}>{deftag}</MenuItem>))}
                    </Select>
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
                    <Divider/>
                    {["1st","2nd","3rd"].map((pn,ind)=>{
                                return(
                                    <TextField
                                        key={ind}
                                        variant="outlined"
                                        margin="normal"
                                        inputRef={register}
                                        style={{width:"30%",marginLeft:"2%"}}
                                        id={"prize-"+(ind+1)}
                                        type="number"
                                        label={pn+" Prize"}
                                        name={pn}
                                        error={!!errors[pn]}
                                        helperText={(errors[pn] ? (errors['pn'].type === 'required' ? "Enter Fee!" : "Invalid Date Format") : null)}
                                    />
                                )
                            })
                    }
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        style={{marginTop:"1%",marginBottom:"2%"}}
                    >Create Match
                     </Button>
                </form>
            </Container>
        </React.Fragment>
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