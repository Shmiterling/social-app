import '../style/form.css';

import React from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular, brands } from '@fortawesome/fontawesome-svg-core/import.macro'


const Form = (props) => {

    //FORM CLOSING FUNCTION
    const logInPopupClose = () => {
        props.setFormDisplay(false);
    }


    //   LOG IN FUNCTION
    let axiosConfig = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    };

    let _input_username = React.createRef();
    let _input_password = React.createRef();

    const [loginPassError, setloginPassError] = useState(false);
    const [userNameError, setUserNameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const logIn = (event) => {

        event.preventDefault();

        let flag = false;

        setloginPassError(false);
        setUserNameError(false);
        setPasswordError(false);

        let Data = {
            username: _input_username.current.value,
            password: _input_password.current.value,
            ttl: 3600
        };


        //ERROR CHECKING
        if (_input_username.current.value === '') {
            setUserNameError(true);
            flag = true;
        }

        if (_input_password.current.value === '') {
            setPasswordError(true);
            flag = true;
        }

        if (flag === false) {
            axios.post(
                'https://akademia108.pl/api/social-app/user/login',
                Data,
                axiosConfig)
                .then((res) => {
                    if (res.data.error === true) {
                        setloginPassError(true);
                    } else {
                        localStorage.setItem('username', res.data.username)
                        localStorage.setItem('id', res.data.id)
                        localStorage.setItem('jwt_token', res.data.jwt_token)
                        localStorage.setItem('ttl', res.data.ttl)
                        window.location.href = '/social-app'
                    }
                })
                .catch((err) => {
                    console.log("AXIOS ERROR: ", err);
                });
        }
    };



    return (
        <div>
            <aside id='log-in-popup'>
                <div className='form-container'>
                    <form>

                        {props.showCloseButton && <FontAwesomeIcon onClick={logInPopupClose} className='xmark' icon={solid('xmark')}></FontAwesomeIcon>}
                        <h1>Log In</h1>
                        <div className="errors-container">
                            {loginPassError && <p className="error">Login or password is wrong.</p>}
                            {userNameError && <p className="error">The username field is required.</p>}
                            {passwordError && <p className="error">The password field is required.</p>}
                        </div>

                        <input ref={_input_username} type="text" placeholder="Username"></input>
                        <input ref={_input_password} type="password" placeholder="Password"></input>
                        <button type='submit' onClick={logIn}>Log In</button>
                        <p>Don't have and account? <Link to='/SignUp'>Sign Up</Link></p>
                    </form>
                </div>
            </aside>
        </div>
    )
};

export default Form;