import React, { useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Dashboard from './components/dashboard/Dashboard'
import ProjectDetails from './components/projects/ProjectDetails'
import SignIn from './components/auth/SignIn'
import SignUp from './components/auth/SignUp'
import CreateProject from './components/projects/CreateProject'
import Wallet from './components/wallet/Wallet'
import { isLoaded } from 'react-redux-firebase'
import {useSelector} from "react-redux"
// Other
import EnterMatch from './components/matches/EnterMatch'
import EnrolledMatches from './components/matches/EnrolledMatches'
import HandleCallbackPaytm from './components/wallet/HandleCallbackPaytm'
import HandleCallbackPaytmErr from './components/wallet/HandleCallbackPaytmErr'
//Admin
import CreateMatch from './components/adminPanel/CreateMatch'
import UpdateMatch from './components/adminPanel/UpdateMatch'
import UpdateMatchList from './components/adminPanel/UpdateMatchList'
import AdminHome from './components/adminPanel/AdminHome'
import ManualPayment from './components/adminPanel/ManualPayment'

//Styling
import { MuiThemeProvider, createMuiTheme  } from '@material-ui/core/styles';
import themeObject from './themeObject.json'
import CssBaseline from '@material-ui/core/CssBaseline';
import Landing from './components/layout/Landing';
import Nav from "./components/layout/Nav";
import SnackSnackbar from './components/SnackSnackbar'
import AlertDialog from './components/AlertDialog'
import BackDrop from './components/BackDrop';
import { ReactComponent as Loading } from './imgs/loading.svg';


const AuthIsLoaded = ({children})=>{
    const auth = useSelector(state=>state.firebase.auth);
  if(!isLoaded(auth)) return (
    <div>
      <Loading className="authLoad"/>
    </div>
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
    const [theme, toggleDarkMode] = useDarkMode();
    console.log("themeObject :-", themeObject.palette);
    const themeConfig = createMuiTheme(theme)
    console.log(themeConfig);
    
    let Navbottom = matchStr(window.location.pathname, "/kand") ? null : <Nav modeControl={toggleDarkMode} />;
    return (
      <BrowserRouter>
        <AuthIsLoaded>
          <MuiThemeProvider theme={themeConfig}>
          <BackDrop/>
          <SnackSnackbar />
          <AlertDialog/>
            <div className="App">
            <CssBaseline />
              <Switch>
                <Route exact path='/dashboard'component={Dashboard} />
                <Route path='/project/:id' component={ProjectDetails} />
                <Route path='/signin' component={SignIn} />
                <Route path='/signup' component={SignUp} />
                <Route path='/create' component={CreateProject} />
                <Route exact path='/' component={Landing}/>
                <Route exact path='/wallet/:use/:mny' component={Wallet}/>
                <Route path="/entermatch/:mid" component={EnterMatch}/>
                <Route path="/enrolledmatches/" component={EnrolledMatches}/>

                {/* <Route path="/p_callback/:mny" component={HandleCallbackPaytm}/>
                <Route path="/p_callbackerr/" component={HandleCallbackPaytmErr}/> */}

                {/* Admin  Paths */}
                <Route path="/admin/creatematch" component={CreateMatch}/>
                <Route path="/admin/updatematch/:mid" component={UpdateMatch}/>
                <Route path="/admin/updatematch" component={UpdateMatchList}/>
                <Route exact path="/admin" component={AdminHome}/>
                <Route path="/admin/manualpayment" component={ManualPayment}/>

              </Switch>
              {Navbottom}
            </div>
          </MuiThemeProvider >
        </AuthIsLoaded>
      </BrowserRouter>
    );
}

export default App;