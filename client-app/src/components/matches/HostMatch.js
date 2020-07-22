import React from 'react'
import {Select, MenuItem, TextField, Divider, Button, Container, Grid, makeStyles, Typography, Icon, MobileStepper, Switch } from '@material-ui/core'
import {useForm, useFieldArray, Controller} from "react-hook-form";
import {compdate,getCurrentDate, convt, getInputDateTime, getPrizeNames} from '../../Functions';
import {hostMatch} from '../../store/actions/MatchActions'
import { connect, useSelector, useDispatch } from 'react-redux';
import {firestoreConnect, useFirestoreConnect} from 'react-redux-firebase';
import {createMatch} from '../../store/actions/MatchActions'
import { AddCircle, DeleteForeverRounded } from "@material-ui/icons";
import { compose } from 'redux';
import { showDialog } from '../../store/actions/uiActions';
import { Helmet } from 'react-helmet';
import Axios from 'axios';
import { BuyCoinsBox } from '../Small Components/BuyCoinsBox/BuyCoinsBox';
import { creditWithRazor, dispatchCreateOrder } from '../../store/actions/PaymentActions';

const useStyles= makeStyles(theme=>({
    root: {
        display: 'flex',
        minHeight: '100vh'
    },
    container: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(16)
    },
    stepper: {
        marginBottom: theme.spacing(7)
    },
    hText:{
        marginTop:theme.spacing(4),
        marginBottom:theme.spacing(2)
    }
}))


const PaymentOptionsContent = ({money, hClick}) => {
    return(
        <Container>
            <Grid container>
                <Grid item xs={12}>
                    <Typography>You need to Pay ₹{money}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Button color='primary' variant='text' onClick={()=>hClick('Coins')} ><Icon></Icon> Pay with Coins</Button>
                </Grid>
                <Grid item xs={12}>
                    <Button color='primary' variant='text' onClick={()=>hClick('RPay')} ><Icon></Icon> Pay with Money</Button>
                </Grid>
            </Grid>
        </Container>
    )
}

const HostMatch = ({ matches }) => {
    const {profile, auth} = useSelector(st => st.firebase);
    const dispatch = useDispatch();
    const classes = useStyles();
    const [activeStep,setActiveStep] = React.useState(0);
    const [fullData,setFullData] = React.useState({
        name:'',mdate:getCurrentDate(2),mtime:'17:00',lrdate:getCurrentDate(1),view:'cao',team:'cao',deftag:'cao',
        map:'cao',fee:1,bKills:0,survival:['0','0','0'],rules:[],isPaid:false,hasCPK:false,isSurvival:true,matchOnSameDay:false
    })
    const { register, handleSubmit, errors, control, reset } = useForm({
        defaultValues:{rules:fullData.rules,survival:fullData.survival}
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name:'rules',
    });
    const {fields:fieldsPrize, append:appendPrize, remove:removePrize} = useFieldArray({
        control,
        name:"survival"
    })
    const steps = ['Enter Match Name and Time','Select Match Modes','Add Custom Rules','Select Fees and Prizes','Finalize']
    const getStepContent = (step) => {
        switch(step){
            case 0:
                return (
                    <React.Fragment>
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
                                defaultValue={fullData.name}
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
                                    validate: val => {
                                        matches.map((matx) => {
                                            if(getInputDateTime(0,matx.date.toDate())===val) {
                                                console.log(true)
                                                setFullData(prevFData =>{return {...prevFData,matchOnSameDay:true}})
                                            }else {
                                                console.log(false)
                                                setFullData(prevFData =>{return {...prevFData,matchOnSameDay:false}})
                                            }
                                        })
                                        return val > getCurrentDate()
                                    }
                                })}
                                fullWidth
                                id="mdate"
                                type="date"
                                label="Match Date"
                                name="mdate"
                                defaultValue={fullData.mdate}
                                error={!!errors.mdate}
                                helperText={(errors.mdate ? (errors.mdate.type === 'required' ? "Enter Match Date!" : "Invalid Date") : null)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                inputRef={register({
                                    required: true,
                                    validate: value => {
                                        let rt = true;
                                        matches.forEach(match => {
                                            rt = fullData.matchOnSameDay && getInputDateTime(1,match.date.toDate())===value;
                                        })
                                        return !rt;
                                    }
                                })}
                                fullWidth
                                id="mtime"
                                type="time"
                                label="Match Time"
                                name="mtime"
                                defaultValue={fullData.mtime}
                                error={!!errors.mtime}
                                helperText={(errors.mtime ? (errors.mtime.type === 'required' ? "Enter Match Time!" : (errors.mtime.type === "validate" ? "Another Match on Same Time" : "Invalid Time")) : null)}
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
                                defaultValue={fullData.lrdate}
                                error={!!errors.lrdate}
                                helperText={(errors.lrdate ? (errors.lrdate.type === 'required' ? "Enter Last Reg. Date!" : "Invalid Date") : null)}
                            />
                        </Grid>
                    </React.Fragment>
                )
            case 1:
                return (
                    <React.Fragment>
                        <Grid item xs={12}>
                            <Controller name="team" 
                                defaultValue={fullData.team}
                                control={control}
                                rules={{validate: val => val!=='cao'}}
                                as={
                                    <Select
                                    id="team"
                                    name="team"
                                    fullWidth
                                    label="Select Team Type"
                                    inputRef={register({
                                        validate: val => val === 'cao',
                                    })}
                                    error={!!errors.team}
                                    style={{color:"#ffffff"}}
                                >
                                    <MenuItem key={""} innerRef={{name:"cao"}} name="cao" value={'cao'} disabled>Choose an Option</MenuItem>
                                    {['Solo','Duo','Squad'].map(team=>(<MenuItem innerRef={{name:team}} name={team} key={team} value={team}>{team}</MenuItem>))}
                                </Select>
                            }/>
                            <Divider/>
                            {errors.team ? <Typography variant="caption" color='error'>Select Valid Option</Typography> : null}
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="view"
                                defaultValue={fullData.view}
                                control={control}
                                rules={{validate: val => val!=='cao'}}
                                as={<Select
                                    inputRef={register({
                                        required: true,
                                    })}
                                    name="view"
                                    id="view"
                                    fullWidth
                                    label="Select Perspective"
                                    error={!!errors.view}
                                    style={{color:"#ffffff"}}
                            >   
                                    <MenuItem key={""} innerRef={{name:"cao"}} name="cao" value={'cao'} disabled>Choose an Option</MenuItem>
                                    {['TPP','FPP'].map(view=>(<MenuItem key={view} name={view} innerRef={{name:view}} value={view}>{view}</MenuItem>))}
                                </Select>}
                            />
                            <Divider/>
                            {errors.view && errors.view.type === 'validate' ? <Typography variant="caption" color='error'>Select Valid Option</Typography> : null}
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="map"
                                defaultValue={fullData.map}
                                control={control}
                                rules={{validate: val => val!=='cao'}}
                                as={<Select
                                    inputRef={register({
                                        required: true,
                                    })}
                                    name="map"
                                    id="map"
                                    fullWidth
                                    error={!!errors.map}
                                    label="Select Map"
                                    style={{color:"#ffffff"}}
                                >
                                    <MenuItem key={"cao"} innerRef={{name:"cao"}} name="cao" value={'cao'} disabled>Choose an Option</MenuItem>
                                    {['Erangel','Miramar','Sanhok','Vikendi'].map(map=>(<MenuItem innerRef={{name:map}} name={map} key={map} value={map}>{map}</MenuItem>))}
                                </Select>}
                            />
                            <Divider/>
                            {errors.map ? <Typography variant="caption" color='error'>Select Valid Option</Typography> : null}
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="deftag"
                                defaultValue={fullData.deftag}
                                control={control}
                                rules={{validate: val => val!=='cao'}}
                                    as={<Select
                                    label="Select Platform"
                                    name="deftag"
                                    fullWidth
                                    id="deftag"
                                    error={!!errors.deftag}
                                    inputRef={register({
                                        required: true,
                                    })}
                                    style={{color:"#ffffff",position:'relative'}}
                                >
                                    <MenuItem key={"cao"}  name="cao" value={'cao'} disabled>Choose an Option</MenuItem>
                                    {['mobile','emu'].map(deftag=>(<MenuItem name={deftag} innerRef={{name:deftag}} key={deftag} value={deftag}>{deftag}</MenuItem>))}
                                </Select>}
                            />
                            <Divider/>
                            {errors.deftag ? <Typography variant="caption" color='error'>Select Valid Option</Typography> : null}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                inputRef={register()}
                                id="tags"
                                defaultValue={fullData.tags}
                                type="text"
                                label="Tags"
                                name="tags"
                                error={!!errors.tags}
                                helperText={(errors.tags ? (errors.tags.type === 'required' ? "Enter Tags!" : "Invalid Tags") : null)}
                            />
                        </Grid>
                    </React.Fragment>
                )
            case 2:
                return (
                    <React.Fragment>
                        {fields.map((item,inx)=>(
                            <React.Fragment key={item.id}>
                                <Grid item xs={10}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    id={`rules[${inx}]`}
                                    name={`rules[${inx}]`}
                                    type='text'
                                    label={"Rule "+(inx+1)}
                                    fullWidth
                                    defaultValue={fullData.rules[inx]}
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
                        <Grid item xs={7}>
                            <Button variant='text' color='primary' onClick={()=>{append()}}>
                                <Icon style={{marginRight:'1vh'}}><AddCircle/></Icon> Add Rule
                            </Button>
                        </Grid>
                    </React.Fragment>
                )
            case 3:
                return (
                    <React.Fragment>
                        <Grid item xs={3}>
                            <Typography variant='h6' style = {{marginTop:'3vh'}}>{fullData.isPaid ? "Paid" : "Free"}</Typography>
                        </Grid>
                        <Grid item xs={3} style = {{marginTop:'3vh'}}>
                            <Switch name="isPaid"  id="isPaid" checked={fullData.isPaid} onChange={handleSwitch}/>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                id="fee"
                                disabled={!fullData.isPaid}
                                inputRef={register({
                                    required: true,
                                    validate: val=> !fullData.isPaid || val!=='0'
                                })}
                                defaultValue={fullData.fee}
                                type="number"
                                label="Fee"
                                name="fee"
                                error={!!errors.fee}
                                helperText={(errors.fee ? (errors.fee.type === 'required' ? "Enter Fee!" : "Fee Cannot be Zero") : null)}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <Typography variant='h6' style = {{marginTop:'0vh'}}>{fullData.hasCPK ? "Has Coin Per Kill" : "No Coin Per Kill"}</Typography>
                        </Grid>
                        <Grid item xs={3} style = {{marginTop:'3vh'}}>
                            <Switch name="hasCPK"  id="hasCPK" checked={fullData.hasCPK} onChange={handleSwitch} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                id="bKills"
                                disabled={!fullData.hasCPK}
                                inputRef={register({
                                    required: true,
                                    validate: val=> !fullData.hasCPK || val!=='0'
                                })}
                                defaultValue={fullData.bKills}
                                type="number"
                                label="Coins Per Kill"
                                name="bKills"
                                error={!!errors.bKills}
                                helperText={(errors.kills ? (errors.bKills.type === 'required' ? "Enter Coins Per Kill!" : "Coins Per Kill Cannot be Zero") : null)}
                            />
                        </Grid>
                        <Divider/>
                        <Grid item xs={3}>
                            <Typography variant='h6' style = {{marginTop:'3vh'}}>{fullData.isSurvival ? "Has Prizes" : "No Prizes"}</Typography>
                        </Grid>
                        <Grid item xs={3} style = {{marginTop:'3vh'}}>
                            <Switch name="isSurvival"  id="isSurvival" checked={fullData.isSurvival} onChange={handleSwitch}/>
                        </Grid>
                        <Divider/>
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
                                        defaultValue={fullData.survival[ind]}
                                        disabled={!fullData.isSurvival}
                                        label={getPrizeNames(ind)+" Prize"}
                                        name={"survival["+(ind+1)+"]"}
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
                            </React.Fragment>))
                        }
                        <Grid item xs={7}>
                            <Button variant='text' color='primary' onClick={()=>{appendPrize()}}>
                                <Icon style={{marginRight:'1vh'}}><AddCircle/></Icon> Add Prize
                            </Button>
                        </Grid>
                        {/** ["1st","2nd","3rd"].map((pn,ind)=>{
                                    return(
                                        <Grid key={ind} item xs={4}>
                                            <TextField
                                                variant="outlined"
                                                margin="normal"
                                                inputRef={register}
                                                id={"prize["+(ind)+"]"}
                                                type="number"
                                                defaultValue={fullData.prize[(ind)]}
                                                label={pn+" Prize"}
                                                name={"prize["+(ind)+"]"}
                                                error={!!errors["prize["+(ind+1)+"]"]}
                                                helperText={(errors[pn] ? (errors[pn].type === 'required' ? "Enter Fee!" : "Invalid Date Format") : null)}
                                            />
                                        </Grid>
                                    )
                                })
                        */ }
                    </React.Fragment>
                )
            case 4:
                const prizeList = fullData.isSurvival ? fullData.survival.map((item,inx) => {
                    return getPrizeNames(inx+1)+":"+item
                }) : null
                const totalExpense = calculateTotalExpense();
                return (
                    <React.Fragment>
                        <Grid item xs={12}><Typography variant="body2">Match Name : {fullData.name}</Typography></Grid>
                        <Grid item xs={12}><Typography>Match Date : {fullData.mdate}</Typography></Grid>
                        <Grid item xs={12}><Typography>L.Reg Date : {fullData.lrdate}</Typography></Grid>
                        <Grid item xs={12}><Typography>Match Time : {convt(1,fullData.mtime)}</Typography></Grid>
                        <Grid item xs={12}><Typography>Match Mode Details : {fullData.team+"-"+fullData.view+"-"+fullData.map}</Typography></Grid>
                        <Grid item xs={12}><Typography>Match Tags : {fullData.tags}</Typography></Grid>
                        <Grid item xs={12}><Typography>Entry Fee : {fullData.isPaid ? fullData.fee : "Free"}</Typography></Grid>
                        <Grid item xs={12}><Typography>Prizes : {fullData.isSurvival ? prizeList.toString() : "Disabled" }</Typography></Grid>
                        <Grid item xs={12}><Typography> Coin Per Kill : {fullData.hasCPK ? fullData.bKills : "Disabled" }</Typography></Grid>
                        {fullData.isPaid ? 
                            <React.Fragment>
                                <Grid item xs={12}><Typography> Now, we need a favour!</Typography></Grid>
                                <Grid item xs={12}><Typography> Your Match's Total Collection: {`${fullData.fee} x ${totalExpense.plno} = ${totalExpense.totalCollection}`}</Typography></Grid>
                                <Grid item xs={12}><Typography> Your Match`s Total PrizePool: {totalExpense.prizePool}</Typography></Grid>
                                <Grid item xs={12}><Typography> Your Profit: {totalExpense.profit}</Typography></Grid>
                                <Grid item xs={12}><Typography> So, for our expenses we need 10% of your profit i.e. 10% of {totalExpense.profit} = ₹{totalExpense.tenpc} only!</Typography></Grid>
                            </React.Fragment>
                            : null
                        }
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
                    </React.Fragment>
                )
            default:
                return <Typography>ERRQX</Typography>
        }
    }

    const handleNext = (data,e)=>{
        e.preventDefault();
        setFullData(prevfullData => {return {...prevfullData,...data}})
        //console.log(data,fullData);
        if( activeStep >= steps.length-1 ){
            //final Submission
            let yn = window.confirm();
            if(!yn) return;
            let totalExp = calculateTotalExpense();
            /**
            const hClick = (popt) => {
                switch(popt){
                    case 'Coins':

                    break;
                    case 'RPay':
                        rpayfunc.pay(totalExp)

                }
                //dispatch(hostMatch(fullData))
            }
             */
            //dispatch(showDialog({title:'Payument Mode',content:<PaymentOptionsContent money={totalExp.tenpc} hClick={hClick} />}))
            const fAction = ({data},rpayData) => {
                console.log(rpayData);
                if(data.success){
                    let amtPaid = rpayData.amount / 100;
                    let cdate = new Date()
                    cdate.setTime(rpayData.created_at)
                    if(amtPaid > totalExp.tenpc){
                        dispatch(creditWithRazor(rpayData.id,{...data,amount:(rpayData.amount/100),receipt:rpayData.receipt,createdAt:cdate,mode:'RPAY'}))
                        dispatch(hostMatch(fullData,totalExp,false));
                    }else if(amtPaid === totalExp.tenpc) {
                        //Less Transaction Work Done
                        dispatch(dispatchCreateOrder(rpayData.id,{...data,amount:(rpayData.amount/100),receipt:rpayData.receipt,createdAt:cdate,mode:'RPAY'}))
                        dispatch(hostMatch(fullData,totalExp,true));
                    }
                    reset();
                }else{
                    //Payment Failed
                }
            }
            if(profile.wallet < totalExp.tenpc){
                let diff = totalExp.tenpc - profile.wallet;
                dispatch(showDialog({title:'Payment for Hosting Match',content:<BuyCoinsBox prefill={{name: auth.displayName,email: auth.email,number:profile && profile.mno}} finalAction={fAction} amount={diff}/>}))
            }else dispatch(hostMatch(fullData,totalExp,false));
            
            return;
        }
        setActiveStep(prevStep=>prevStep+1);
    }
    const handleSwitch = (e) => {
        setFullData({...fullData,[e.target.id]:e.target.checked})
    }
    const handleBack = ()=> setActiveStep(prevStep=>prevStep-1)
    const calculateTotalExpense = () => {
        let total = 0;
        let data = {totalCollection:0,prizePool:0,plno:0,profit:0,tenpc:0};
        if(fullData.isPaid){
            if(fullData.isSurvival){
                //console.log("isSurvival")
                switch(fullData.team){
                    case "Solo":
                        data['plno'] = 100
                        data['totalCollection'] = fullData.fee * 100;
                        break;
                    case "Duo":
                        data['plno'] = 50
                        data['totalCollection'] = fullData.fee * 50;
                        break;
                    case "Squad":
                        data['plno'] = 25
                        data['totalCollection'] = fullData.fee * 25;
                        break;
                    default:
                        break;
                }
                fullData.survival.forEach(pr => data['prizePool'] += parseInt(pr))
            }
            if(fullData.hasCPK){
                //console.log("CPK")
                data['prizePool'] += 99 * parseInt(fullData.bKills);
            }
            data['profit'] = data['totalCollection'] - data['prizePool'];
            data['tenpc'] = parseInt(10/100 * data['profit']);
            let prst = data['tenpc'].toString();
            let unitpos = parseInt(prst[prst.length-1])
            let diff = unitpos === 0 ? 0 : (unitpos < 5 ? 0 - unitpos : 10 - unitpos)
            data['tenpc'] += diff;
            data['profit'] = 10 * data['tenpc']
        }
        return data;
    }

    return (
        <div className={classes.root}>
            <Helmet>
                <script src='https://checkout.razorpay.com/v1/checkout.js'></script>
            </Helmet>
            <form noValidate onSubmit={handleSubmit(handleNext)}>
                <Container className={classes.container}>
                    <Typography variant='h5' className={classes.hText}>Create a New Match</Typography>
                    <Typography variant='h6' className={classes.hText}>{steps[activeStep]}</Typography>
                    <Grid container spacing={2}>
                        {fullData && getStepContent(activeStep)}
                    </Grid>
                </Container>
                <MobileStepper className={classes.stepper} activeStep={activeStep} position='bottom' steps={steps.length} variant='dots' 
                    backButton={<Button disabled={activeStep === 0} onClick={handleBack}>Back</Button>} nextButton={<Button disabled={activeStep === steps.length-1} type='submit'>Next</Button>} 
                />
            </form>
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
)(HostMatch);