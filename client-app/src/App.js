import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Dashboard from './components/dashboard/Dashboard'
import SignIn from './components/auth/SignIn'
import SignUp from './components/auth/SignUp'
import Wallet from './components/pages/wallet/Wallet'
import RequestWithDraw from './components/pages/wallet/RequestWithDraw'
import { isLoaded } from 'react-redux-firebase'
import {useSelector, useDispatch} from "react-redux"
import { ProtectedRoutes } from './components/auth/ProtectedRoutes'
// Other
import EnterMatch from './components/matches/EnterMatch'
import EnrolledMatches from './components/matches/EnrolledMatches'
import Match from './components/matches/Match'
import HostMatch from './components/matches/HostMatch'

//Admin
import CreateMatch from './components/adminPanel/CreateMatch'
import UpdateMatch from './components/adminPanel/UpdateMatch'
import UpdateMatchList from './components/adminPanel/UpdateMatchList'
import AdminHome from './components/adminPanel/AdminHome'
import ManualPayment from './components/adminPanel/ManualPayment'
import MatchDetails from './components/adminPanel/MatchDetails'
import UpdateMatchFacts from './components/adminPanel/UpdateMatchFacts'
import CancelMatch from './components/adminPanel/CancelMatch'
import CancelMatchList from './components/adminPanel/CancelMatchList'
import WithdrawalList from './components/adminPanel/WithdrawalList'
import SendNotifications from './components/adminPanel/SendNotifications'

//Styling
import { MuiThemeProvider, createMuiTheme  } from '@material-ui/core/styles';
import themeObject from './themeObject.json'
import CssBaseline from '@material-ui/core/CssBaseline';
import Landing from './components/pages/Landing';
import Nav from "./components/layout/Nav";
import SnackSnackbar from './components/ui/SnackSnackbar'
import AlertDialog from './components/ui/AlertDialog'
import BackDrop from './components/ui/BackDrop';
import Loader from './components/ui/BackDrop/Loader';
import { ReactComponent as Loading } from './imgs/loading.svg';
import { dark } from '@material-ui/core/styles/createPalette';
import { Button } from '@material-ui/core';
import { setInstallApp, setAppInstalled } from './store/actions/uiActions';
import HostedMatches from './components/matches/HostedMatches';


const AuthIsLoaded = ({children})=>{
    const auth = useSelector(state=>state.firebase.auth);
  if(!isLoaded(auth)) return (
    <Loader />
    // <div>
    //   <Loading className="authLoad"/>
    // </div>
  )
    return (children);
}

const matchStr = (str, rule) => {
  var eR = (str) => str.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1");
  return new RegExp("^" + rule.split("*").map(eR).join(".*") + "$").test(str);
}



const useDarkMode = () => {
  const [theme, setTheme] = useState(themeObject)
  const { palette: { type } } = theme;
  const toggleDarkMode = () => {
    const updatedTheme = {
      ...theme,
      palette: {
        ...theme.palette,
        type: type === 'light' ? 'dark' : 'light'
      }
    }
    setTheme(updatedTheme)
  }
  return [theme, toggleDarkMode]
}

const App = () => {
    const dispatch = useDispatch();
    const [theme, toggleDarkMode] = useDarkMode();
    console.log("themeObject :-", themeObject.palette);
    const themeConfig = createMuiTheme(theme)
    console.log(themeConfig);
    window.addEventListener('beforeinstallprompt',(e)=>{
      console.log("Setting Open BUTTON")
      e.preventDefault();
      dispatch(setInstallApp(e));
      dispatch(setAppInstalled(false));
    })
    window.addEventListener('appinstalled',(e)=>{
      dispatch(setAppInstalled(true))
    })
    //let Navbottom = matchStr(window.location.pathname, "/") ? null : <Nav modeControl={toggleDarkMode} />;
    let Navbottom = <Nav modeControl={toggleDarkMode}/>
    return (
      <BrowserRouter>
        <MuiThemeProvider theme={themeConfig}>
        <AuthIsLoaded>
          <BackDrop/>
          <SnackSnackbar />
          <AlertDialog/>
            <div className="App">
            <CssBaseline />
              <Switch>
                <ProtectedRoutes exact path='/dashboard'component={Dashboard} />
                <Route path='/signin/' component={SignIn} />
                <Route path='/signup' component={SignUp} />
                <Route exact path='/' component={Landing}/>
                {/* <Route exact path='/:gti' component={Landing}/> This is intended for Getting-Started Tour*/}
                <ProtectedRoutes exact path='/wallet/:use/:mny' component={Wallet}/>
                <ProtectedRoutes path="/reqwithdrawal" component={RequestWithDraw} />
                <ProtectedRoutes path="/entermatch/:mid" component={EnterMatch}/>
                <ProtectedRoutes path="/enrolledmatches/" component={EnrolledMatches}/>
                <ProtectedRoutes path="/match/:mid" component={Match}/>
                <ProtectedRoutes path="/hostmatch/" component={HostMatch}/>
                <ProtectedRoutes path="/hostedmatches/" component={HostedMatches}/>

                {/* Admin  Paths */}
                <ProtectedRoutes path="/admin/creatematch" component={CreateMatch}/>
                <ProtectedRoutes path="/admin/updatematch/:mid" component={UpdateMatch}/>
                <ProtectedRoutes path="/admin/updatematch" component={UpdateMatchList}/>
                <ProtectedRoutes path="/admin/manualpayment" component={ManualPayment}/>
                <ProtectedRoutes path="/admin/matchdetails/:mid" component={MatchDetails}/>
                <ProtectedRoutes path="/admin/updatematchfacts/:mid" component={UpdateMatchFacts}/>
                <ProtectedRoutes path="/admin/cancelmatch/:mid" component={CancelMatch}/>
                <ProtectedRoutes path="/admin/cancelmatchlist" component={CancelMatchList}/>
                <ProtectedRoutes path="/admin/withdrawalreqlist/" component={WithdrawalList}/>
                <ProtectedRoutes path="/admin/sendnotifications/" component={SendNotifications}/>
                <ProtectedRoutes exact path="/admin" component={AdminHome}/>

                <Route path="*" component={() => "404: Not Found! Wrong URL"}/>
              </Switch>
              {Navbottom}
            </div>
          </AuthIsLoaded>
        </MuiThemeProvider >
      </BrowserRouter>
    );
}

export default App;