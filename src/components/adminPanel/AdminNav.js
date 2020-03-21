import React from 'react';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import {signOut} from '../../store/actions/authActions';
import { Helmet } from 'react-helmet'

/*
  This Component is used to generate a Navbar with a List of Links to Different Admin Actions
*/

const AdminNav = (props)=>{
    const adminlinks = (//admin links
    <ul className="tabs tabs-transparent">
        <li className="tab"><Link to="" onClick={props.signOut}>LogOut</Link></li>
        <li className="tab"><Link to="/admin/creatematch/">Create Match</Link></li>
        <li className="tab"><Link to="/admin/updatematch">Update Match</Link></li>
        <li className="tab"><Link to="/admin/manualpayment">Manual Payment</Link></li>
        <li className="tab"><Link to="/admin/sendnotifications">Send Notifications</Link></li>
    </ul>)
    return(
    <React.Fragment>
        <Helmet>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css"/>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
        </Helmet>
        <nav className="nav-extended">
            <div className="nav-wrapper black">
                <Link to="/admin" className="brand-logo">Admim Panel</Link>
            </div>
            <div className="nav-content black">
                {adminlinks}
            </div>
        </nav>
    </React.Fragment>
    )
}


const mapDispatchtoProps = (dispatch)=>{
    return{
        signOut:()=>dispatch(signOut())
    }
}
export default connect(null,mapDispatchtoProps)(AdminNav);