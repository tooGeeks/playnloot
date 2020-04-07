import React from 'react';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import {signOut} from '../../Store/Actions/AuthActions';
import {Redirect} from 'react-router-dom';

/*
  This Component is used to generate a Navbar with a List of Links to Different Admin Actions
*/

const AdminNav = (props)=>{
    const {auth} = props;
    const adminlinks = (//admin links
    <ul className="tabs tabs-transparent">
        <li className="tab"><Link to="" onClick={props.signOut}>LogOut</Link></li>
        <li className="tab"><Link to="/admin/creatematch/">Create Match</Link></li>
        <li className="tab"><Link to="/admin/withdrawalreqlist/">withdrawal Requests</Link></li>
        <li className="tab"><Link to="/admin/updatematch">Update Match</Link></li>
        <li className="tab"><Link to="/admin/cancelmatch">Cancel Match</Link></li>
        <li className="tab"><Link to="/admin/manualpayment">Manual Payment</Link></li>
        <li className="tab"><Link to="/admin/sendnotifications">Send Notifications</Link></li>
    </ul>)
    if(!auth.uid) return <Redirect to="/signin"></Redirect>
    return(<nav className="nav-extended">
        <div className="nav-wrapper black">
            <Link to="/admin" className="brand-logo">PNLooT(Home)</Link>
        </div>
        <div className="nav-content black">
            {adminlinks}
        </div>
    </nav>

    )
}
const mapStatetoProps = (state) =>{
    return{
        auth:state.firebase.auth
    }
}

const mapDispatchtoProps = (dispatch)=>{
    return{
        signOut:()=>dispatch(signOut())
    }
}
export default connect(mapStatetoProps,mapDispatchtoProps)(AdminNav);