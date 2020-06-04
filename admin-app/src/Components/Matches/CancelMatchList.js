import React from "react";
import {connect} from 'react-redux';
import {firestoreConnect} from 'react-redux-firebase';
import {compose} from 'redux';
import MatchSummary from "../Matches/MatchSummary";
import {getCurrentDate} from '../../Functions'
import { makeStyles, Container, Typography } from "@material-ui/core";


const useStyles = makeStyles(theme=>({
    root:{
        display:'flex',
        minHeight:'100vh'
    },
    container:{
        marginBottom:theme.spacing(8)
    },
    hText:{
        marginTop:theme.spacing(4),
        marginBottom:theme.spacing(2)
    }
}))

const CancelMatchList = (props)=>{
    const classes = useStyles()
    const handleClick = (mid)=>{
        props.history.push("/cancelmatch/"+mid)
    }
    const {matches} = props;
        return(
            <div className={classes.root}>
                <Container className={classes.container}>
                    <Typography variant="h5" className={classes.hText}>Select a Match to Cancel</Typography>
                    {matches && matches.map(match =>{
                        if(match.date.toDate()<getCurrentDate()){//Hides a Match if its Match Date has Passed
                            return null;
                        }
                            return(
                                <MatchSummary maxp='101' isCan={!match.isActive} match={match} handleClick={handleClick}  bttnname={"Select"} key={match.id}/>
                            )
                        })}
                </Container>
            </div>
        )
}
const mapStatetoProps = (state)=>{
    return{
        matches:state.firestore.ordered.Matches
    }
}

export default compose(
    connect(mapStatetoProps),
    firestoreConnect([
        {collection:'Matches'}
    ])
)(CancelMatchList);