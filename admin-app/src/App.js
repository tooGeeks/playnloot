import React, { useState } from 'react';


import AdminHome from './Components/Home/AdminHome'
import Nav from './Components/Home/Nav'

import CancelMatch from './Components/Matches/CancelMatch'
import CancelMatchList from './Components/Matches/CancelMatchList'
import CreateMatch from './Components/Matches/CreateMatch'
import MatchDetails from './Components/Matches/MatchDetails'
import UpdateMatch from './Components/Matches/UpdateMatch'
import UpdateMatchList from './Components/Matches/UpdateMatchList'
import UpdateMatchFacts from './Components/Matches/UpdateMatchFacts'

import ManualPayment from './Components/Payments/ManualPayment'
import WithdrawalList from './Components/Payments/WithdrawalList'

import SendNotifications from './Components/Notifications/SendNotifications'



import { isLoaded } from 'react-redux-firebase'
import {useSelector} from "react-redux"
import BackDrop from './Components/UI/BackDrop/BackDrop';
import Loader from './Components/UI/BackDrop/Loader';
import themeObject from './themeObject.json'
import { MuiThemeProvider, createMuiTheme  } from '@material-ui/core/styles';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import AlertDialog from './Components/UI/AlertDialog';
import CssBaseline from '@material-ui/core/CssBaseline';
import SnackSnackbar from './Components/UI/SnackSnackbar';
import {ProtectedRoutes} from './Components/Auth/ProtectedRoutes'
import SignIn from './Components/Auth/SignIn'

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

function App() {
    const [theme, toggleDarkMode] = useDarkMode();
    console.log("themeObject :-", themeObject.palette);
    const themeConfig = createMuiTheme(theme)
    console.log(themeConfig);
    let Navbottom = <Nav modeControl={toggleDarkMode}/>
    return (
      <BrowserRouter>
        <MuiThemeProvider theme={themeConfig}>
          <AuthIsLoaded>
            <BackDrop/>
            <SnackSnackbar/>
            <AlertDialog/>
            <div className="App">
              <CssBaseline/>
              <Switch>
                <Route path="/signin" component={SignIn} />
                <ProtectedRoutes path="/creatematch" component={CreateMatch}/>
                <ProtectedRoutes path="/updatematch/:mid" component={UpdateMatch}/>
                <ProtectedRoutes path="/updatematch" component={UpdateMatchList}/>
                <ProtectedRoutes path="/manualpayment" component={ManualPayment}/>
                <ProtectedRoutes path="/matchdetails/:mid" component={MatchDetails}/>
                <ProtectedRoutes path="/updatematchfacts/:mid" component={UpdateMatchFacts}/>
                <ProtectedRoutes path="/cancelmatch/:mid" component={CancelMatch}/>
                <ProtectedRoutes path="/cancelmatchlist" component={CancelMatchList}/>
                <ProtectedRoutes path="/withdrawalreqlist/" component={WithdrawalList}/>
                <ProtectedRoutes path="/sendnotifications/" component={SendNotifications}/>
                <ProtectedRoutes exact path="/" component={AdminHome}/>
              </Switch>
              {Navbottom}
            </div>
          </AuthIsLoaded>
        </MuiThemeProvider>
      </BrowserRouter>
    );
}

export default App;