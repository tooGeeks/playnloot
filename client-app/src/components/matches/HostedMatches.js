import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import MatchSummary from './adminMatchSummary'
import { makeStyles, Container, Typography } from '@material-ui/core'
import { Redirect } from 'react-router-dom'
import { findinMatches, calculateTotalExpense, jsonTOArray } from '../../Functions'

const useStyles= makeStyles(theme=>({
    root: {
        display: 'flex',
        minHeight: '100vh'
    },
    container: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(7)
    },
    hText:{
        marginTop:theme.spacing(4),
        marginBottom:theme.spacing(2)
    }
}))

const HostedMatches = (props) => {
    const classes = useStyles();
    const matches = props.matches;
    console.log(matches);
    const updateMatch = (mid,updFields) => {
        console.log(updFields);
        let oldMatch = findinMatches(matches,mid);
        let newMatch = {...oldMatch};
        newMatch = {...newMatch,...updFields};
        //Pass isPaid, isSurvival, team, hasCPK, fee
        let oldCalc = calculateTotalExpense({isPaid:oldMatch.fee>0?true:false,isSurvival:oldMatch.survival?true:false,survival:jsonTOArray(oldMatch.survival),team:oldMatch.team,hasCPK:oldMatch.hasCPK,fee:oldMatch.fee});
        let newCalc = calculateTotalExpense({isPaid:newMatch.fee>0?true:false,isSurvival:newMatch.survival?true:false,survival:jsonTOArray(newMatch.survival),team:newMatch.team,hasCPK:newMatch.hasCPK,fee:newMatch.fee});
        console.log("oldCalc",oldCalc,"newCalc",newCalc);
        //
    }
    const deleteMatch = (mid) => {
        console.log(mid);
        let yn = window.confirm('Are you sure?');
        //X
    }
    const mdiv = matches && matches.map((match,inx) => {
        return(<MatchSummary key={inx} match={match} isEditable={true} updatefunc={updateMatch} handleClick={deleteMatch} bttnname='Delete Match' />)
    })
    return (
        <div className={classes.root}>
            <Container className={classes.container}>
            <Typography variant='h5' className={classes.hText}>Previously Hosted Matches</Typography>
                {mdiv}
            </Container>
        </div>
    )
}


const mapStatetoProps = (state)=>{
    return{
        auth: state.firebase.auth,
        matches: state.firestore.ordered.Matches,
        profile: state.firebase.profile
    }
}

export default compose(
    connect(mapStatetoProps),
    firestoreConnect((props)=>[
        {collection:'Matches',where:['host','==',props.profile.isLoaded && props.profile.pubgid]}
    ])
)(HostedMatches);
