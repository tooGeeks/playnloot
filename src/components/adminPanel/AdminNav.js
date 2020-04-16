import React from 'react';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {Helmet} from 'react-helmet'

/*
  This Component is used to generate a Navbar with a List of Links to Different Admin Actions
*/

const AdminNav = (props)=>{
    const {auth} = props;
    const adminlinks = (//admin links
    <ul className="tabs tabs-transparent">
        <li className="tab"><Link to="/dashboard">Exit</Link></li>
        <li className="tab"><Link to="/admin/creatematch/">Create Match</Link></li>
        <li className="tab"><Link to="/admin/withdrawalreqlist/">withdrawal Requests</Link></li>
        <li className="tab"><Link to="/admin/updatematch">Update Match</Link></li>
        <li className="tab"><Link to="/admin/cancelmatchlist">Cancel Match</Link></li>
        <li className="tab"><Link to="/admin/manualpayment">Manual Payment</Link></li>
        <li className="tab"><Link to="/admin/sendnotifications">Send Notifications</Link></li>
    </ul>)
    if(!auth.uid) return <Redirect to="/signin"></Redirect>
    return(
    <React.Fragment>
        <Helmet>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css"/>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
        </Helmet>
        <nav className="nav-extended">
            <div className="nav-wrapper black">
                <Link to="/admin" className="brand-logo">PNLooT(Home)</Link>
            </div>
            <div className="nav-content black">
                {adminlinks}
            </div>
        </nav>
    </React.Fragment>
    

    )
}
const mapStatetoProps = (state) =>{
    return{
        auth:state.firebase.auth
    }
}
export default connect(mapStatetoProps)(AdminNav);