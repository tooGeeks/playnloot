import React from 'react'
import { makeStyles, Container, TextField, Typography, Button, Paper } from '@material-ui/core';
import useForm from 'react-hook-form';
import { compose } from 'redux';
import { connect, useDispatch } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { enterMatch } from '../../store/actions/MatchActions';
import { clearDialog } from '../../store/actions/uiActions'


const useStyles = makeStyles(theme=>({
    root: {
        flexGrow: 1,
        marginTop:theme.spacing(5),
        marginBottom: theme.spacing(8),
        justifySelf : 'center',
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    paper: {
        textAlign: 'center',
        padding: theme.spacing(2),
        paddingTop : theme.spacing(2),
        backgroundColor: theme.palette.background.paper
    }
}))

const PlayerEnroll = (props) => {
    const classes = useStyles()
    const dispatch = useDispatch();
    dispatch(clearDialog()); //Clear Dialog
    const {Matches} = props
    const match = Matches && Matches[0]
    const {register,errors,handleSubmit} = useForm()
    let enpdiv; 
    const enroll = (data, e)=>{
        e.preventDefault();
        console.log(data)
        dispatch(enterMatch(match,data))

    }
    switch(match && match.mode){
        default:
            break;
        case "Duo":
            enpdiv = (<React.Fragment>
                <TextField
                id="mate1"
                label="Teammate's PUBGID"
                name="mate1"
                required
                fullWidth
                inputRef={register({
                  required: true
                })}
                error={!!errors["mate1"]}
                />
            </React.Fragment>)
            break
        case "Squad":
            enpdiv = ['1st','2nd','3rd'].map((mate,ind)=>{
                    return(
                        <React.Fragment key={ind}>
                            <TextField
                            variant='outlined'
                            id={"mate"+(parseInt(ind)+1)}
                            name={"mate"+(parseInt(ind)+1)}
                            label={mate+" Mate's PUBGID"}
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
        <React.Fragment>
            <Container className={classes.root}>
                <Paper className={classes.paper}>
                    <Typography component="h1" variant="h5">Enroll in {match && match.name}</Typography><br/><br/>
                    <form noValidate onSubmit={handleSubmit(enroll)}>
                        {enpdiv}<br/>
                        <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        >Confirm Enrollment</Button>
                    </form>
                </Paper>
            </Container>
        </React.Fragment>
    )
}

const mapStatetoProps = (state)=>{
    return{
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