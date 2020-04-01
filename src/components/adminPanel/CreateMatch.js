import React,{Component} from "react";
import { createMatch } from '../../store/actions/MatchActions';
import {connect} from 'react-redux';
import {firestoreConnect} from 'react-redux-firebase';
import {compose} from 'redux';
import {compdate,getCurrentDate} from '../../Functions';
import Nav from './AdminNav'

/*
  This Component is used to Create a New Match
*/

class CreateMatch extends Component{
    state = {
        mdate:'',
        mtime:'',
        lrdate:''
    }
    handleChange = (e)=>{
        this.setState({[e.target.id]:e.target.value});
    }
    
    chkexistmatch = ()=>{//checks if already a match is scheduled on specified date
        const {matches} = this.props;
        return matches.map(match =>{
            return(match.mdate===this.state.mdate)
        })
    }
    handleSubmit = (e)=>{
        e.preventDefault();
        const cds = getCurrentDate();
        const mdt = this.state.mdate;
        const ldt = this.state.lrdate;
        if(compdate(cds,mdt) && compdate(ldt,mdt) && compdate(cds,ldt)){//checks that match date, last enrollment date and today's date are in order
            if(this.chkexistmatch().includes(true)){
                alert("Already A Match on Specified Date");
                return;
            }
            this.props.createMatch(this.state);
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
    render(){
        return(
            <React.Fragment>
                <Nav/>
                <div className="container">
                <form onSubmit={this.handleSubmit}>
                    <label ><b>Date of Match :</b></label>
                    <input type="date" className="white-text" id="mdate" onChange={this.handleChange}/><br/>
                    <label ><b>Time of Match :</b></label>
                    <input type="time" className="white-text" id="mtime" onChange={this.handleChange}/><br/>
                    <label ><b>Last Day of Registration :</b></label>
                    <input type="date" className="white-text" id="lrdate"onChange={this.handleChange}/><br/>
                    <button id="crnmbttn" disabled={!this.state.mdate && !this.state.mtime && !this.state.lrdate} ref={this.reff} className="waves-effect waves-light btn hoverable">Create Match</button>
                    </form>
                </div>
            </React.Fragment>
        )
    }
}

const mapDispatchtoProps = (dispatch) =>{
    return{
        createMatch : (match)=>dispatch(createMatch(match))

    }
}
const mapStatetoProps = (state)=>{
    return{
        matches:state.firestore.ordered.Matches
    }
}

export default compose(
    connect(mapStatetoProps,mapDispatchtoProps),
    firestoreConnect([
        {collection:'Matches'}
    ])
)(CreateMatch);