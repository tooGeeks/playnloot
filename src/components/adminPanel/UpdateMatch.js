import React,{Component} from "react";
import {connect} from 'react-redux';
import {compose} from 'redux';
import {firestoreConnect} from 'react-redux-firebase';
import {updateMatch} from '../../store/actions/MatchActions';
import {compdate,getCurrentDate,findinMatches} from '../../Functions';
import Nav from './AdminNav'

/*
  This Component is used to Update Existing Match 
*/

class UpdateMatch extends Component{
    state = {
        chkmdate:false,
        chklrdate:false,
        chkmtime:false,
        umdate:null,
        umtime:null,
        ulrdate:null
    }
    mid = this.props.match.params.mid;
    lrdmsg = null;
    chkexistmatch = ()=>{// Checks if a match is already on the updated Match Date
        const {matches} = this.props;
        return matches.map(match =>{
            return(match.mdate===this.state.umdate)
        })
    }
    handleChkbox = (e)=>{//Updates State with Checkbox Status
        this.setState({[e.target.id]:e.target.checked})
        this.lrdmsg = !this.state.chkmdate || this.state.chklrdate ? <p className="red-text">Required Field</p> : null ;
    }
    
    handleChange = (e)=>{
        this.setState({[e.target.id]:e.target.value});
    }
    handleSubmit = (e)=>{
        const cds = getCurrentDate();
        e.preventDefault();
        if(!this.state.chkmdate && !this.state.chkmtime && !this.state.chklrdate){//Checks if any update is made or not
            alert("No Updates Made");
            return;
        }
        let mdata = {};
        if(!this.state.chkmdate || !this.state.umdate){//Checks Match Date is Updated or Not
            alert("Please Update Match Date")
            return;
        }
        if(!this.state.chklrdate || !this.state.ulrdate){
            alert("Please Update Last Registration Date")
            return;
        }
        if(compdate(cds,this.state.umdate) && compdate(this.state.ulrdate,this.state.umdate) && compdate(cds,this.state.ulrdate)){
            //^Checks if MDate , LRDate and Today's Date are in Order
            if(this.chkexistmatch().includes(true)){
                alert("Already A Match on Specified Date");
                return;
            }
            mdata['mdate'] = this.state.umdate;
            if(this.state.chkmtime && this.state.umtime) mdata['mtime'] = this.state.umtime;
            mdata['lrdate'] = this.state.ulrdate;
            console.log("PData : ", mdata);
            this.props.updateMatch(this.mid,mdata);
        }
        else{
            if(!compdate(cds,this.state.umdate)){
                window.alert("Tournament Date cannot before or be same as Today");
            }
            if(!compdate(this.state.ulrdate,this.state.umdate)){
                window.alert("Last Registration Date cannot be after or same as Tournament Date");
            }
            if(!compdate(cds,this.state.ulrdate)){
                window.alert("Last Registration Date cannot be before same as or Today");
            }
        }
    }
    render(){
        const {matches} = this.props;
        const match = matches && findinMatches(matches,this.mid)
        return(
            <React.Fragment>
                <Nav/>
                <div className='white-text'>
                <p>Match : {this.mid}</p>
                <form onSubmit={this.handleSubmit}>
                    <label><input type="checkbox" id="chkmdate" onChange={this.handleChkbox}/><span><b>Date of Match :</b></span></label>
                    <input type="date" defaultValue={match && match.mdate} disabled={!this.state.chkmdate} className="white-text" id="umdate" onChange={this.handleChange}/><br/>
                    <label ><input type="checkbox" id="chkmtime" onChange={this.handleChkbox}/><span><b>Time of Match :</b></span></label>
                    <input type="time" defaultValue={match && match.mtime} disabled={!this.state.chkmtime} className="white-text" id="umtime" onChange={this.handleChange}/><br/>
                    <label ><input type="checkbox" id="chklrdate" onChange={this.handleChkbox}/><span><b>Last Day of Registration :</b>{this.lrdmsg}</span></label>
                    <input type="date" defaultValue={match && match.lrdate} disabled={!this.state.chklrdate} className="white-text" id="ulrdate"onChange={this.handleChange}/><br/>
                    <button id="crnmbttn" disabled={(!this.state.chkmdate || !this.state.chklrdate) && !this.state.chkmtime} className="waves-effect waves-light btn hoverable">Update Match</button>
                    </form>
                </div>
            </React.Fragment>
        )
    }
}

const mapDispatchtoProps = (dispatch) =>{
    return{
        updateMatch : (mid,match)=>dispatch(updateMatch(mid,match))

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
)(UpdateMatch);