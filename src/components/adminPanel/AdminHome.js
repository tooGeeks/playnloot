import React,{Component} from "react";
import Nav from './AdminNav'

/*
  This Component is Admin Home
*/

class AdminHome extends Component{
    render(){
        return(
        <React.Fragment>
            <Nav/>
            <div className="container white-text">
                <h3>Welcom Back, Admin</h3>
            </div>
        </React.Fragment>
        )
    }
}

export default AdminHome;