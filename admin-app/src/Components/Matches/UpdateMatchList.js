import React from "react";
import {connect} from 'react-redux';
import {firestoreConnect} from 'react-redux-firebase';
import {compose} from 'redux';
import MatchSummary from "../Matches/MatchSummary";
import { makeStyles, Container, Typography } from "@material-ui/core";

const useStyles = makeStyles(theme=>({
    root:{
        display:'flex',
        minHeight:'100vh'
    },
    container:{
        marginTop:theme.spacing(4),
        marginBottom:theme.spacing(8)
    },
    hText:{
        marginTop:theme.spacing(4),
        marginBottom:theme.spacing(2)
    },
    grid:{
      marginTop:theme.spacing(4),
      marginBottom:theme.spacing(4)
    }
  }))

const UpdateMatchList = (props)=>{
    const classes = useStyles();
    const {matches} = props;
    const handleClick = (mid)=>{
        props.history.push("/updatematch/"+mid)
    }
    return(
        <div className={classes.root}>
            <Container className={classes.container} maxWidth="md">
                <Typography variant="h5" className={classes.hText}>Select Match To Update</Typography>
                {matches && matches.map(match =>{
                        return(
                            <MatchSummary maxp='100' isCan={!match.isActive} match={match} handleClick={handleClick}  bttnname={"Select"} key={match.id}/>
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
)(UpdateMatchList);