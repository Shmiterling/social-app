import '../style/navbar.css';

import React from "react";
import { Link } from 'react-router-dom';

const Navbar = () => {

    const logOut = () => {
        localStorage.clear();
        window.location.href = '/social-app'
    }
    
    let loggedIn = false;
    if (localStorage.jwt_token === undefined) {
        loggedIn = true
    };

    return (
        <div className="Navbar-outside-container">
            <ul className="Navbar-ul">
                <li className="link"><Link to="/social-app">Home</Link></li>
                {loggedIn && <li className="link" ><Link to="/social-app/Login">Login</Link></li>}
                {loggedIn && <li className="link" ><Link to="/social-app/SignUp">Sign up</Link></li>}
                {loggedIn || <li className="link" ><Link to="/social-app/AllFollowed">All Followed</Link></li>}
                {loggedIn || <li className="link" ><Link to="/social-app" onClick={logOut}>Log out</Link></li>}
            </ul>
        </div>
    )
};

export default Navbar;