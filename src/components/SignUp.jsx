import '../style/signup.css';

import axios from "axios";
import React from "react";
import { useState } from "react";
import Navbar from "./Navbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid, regular, brands } from '@fortawesome/fontawesome-svg-core/import.macro';

export default function SignUp() {

    const [passwordVisability, setPasswordVisability] = useState('password');
    const [passwordConfirmationVisability, setPasswordConfirmationVisability] = useState('password');
    const [signingUpSuccess, setSigningUpSuccess] = useState(false);
    const [username, setUsername] = useState('');



    //LOCAL ERRORS STATES
    const [emailError, setEmailError] = useState(false);
    const [samePasswordError, setSamePasswordError] = useState(false);
    const [specialPasswordError, setSpecialPasswordError] = useState(false);
    const [lengthPasswordError, setLengthPasswordError] = useState(false);
    const [numberPasswordError, setNumberPasswordError] = useState(false);
    const [emptyPasswordError, setEmptyPasswordError] = useState(false);
    const [emptyUsernameError, setEmptyUsernameError] = useState(false);
    const [notEmailError, setNotEmailError] = useState(false);

    //API ERRORS STATES
    const [existUsernameError, setExistUsernameError] = useState(false);
    const [existEmailError, setExistEmailError] = useState(false);


    //FORM INPUTS STATES
    let _input_username = React.createRef();
    let _input_email = React.createRef();
    let _input_password = React.createRef();
    let _input_confirm_password = React.createRef();




    //SHOWING PASSWORD FUNCTION
    const showPassword = () => {

        if (passwordVisability === 'password') {
            setPasswordVisability('text')
        } else {
            setPasswordVisability('password')
        }

    }

    const showPasswordConfirmation = () => {

        if (passwordConfirmationVisability === 'password') {
            setPasswordConfirmationVisability('text')
        } else {
            setPasswordConfirmationVisability('password')
        }

    }



    //SIGN IN FUNCTION
    const signUpFunction = (event) => {

        event.preventDefault();

        //FLAG AND ERRORS RESET
        let flag = false;

        setExistUsernameError(false);
        setEmptyUsernameError(false);
        setEmailError(false);
        setExistEmailError(false);
        setSigningUpSuccess(false);
        setEmptyPasswordError(false);
        setNumberPasswordError(false);
        setNotEmailError(false);
        setSpecialPasswordError(false);
        setLengthPasswordError(false);
        setSamePasswordError(false);

        //CHECKING
        if (_input_username.current.value === '') {
            setEmptyUsernameError(true)
            flag = true
        }

        if (_input_email.current.value === '') {
            setEmailError(true);
            flag = true
        }

        if (!_input_email.current.value.match(/(?=.*@)(.{5,})([.])/) && _input_email.current.value !== '') {
            setNotEmailError(true)
            flag = true
        }

        if (_input_password.current.value === '') {
            setEmptyPasswordError(true)
            flag = true
        }

        if (!_input_password.current.value.match(/[0-9]/) && _input_password.current.value !== '') {
            setNumberPasswordError(true)
            flag = true
        }

        if (!_input_password.current.value.match(/[!#@$%)]/) && _input_password.current.value !== '') {
            setSpecialPasswordError(true)
            flag = true
        }

        if (_input_password.current.value.length < 6 && _input_password.current.value !== '') {
            setLengthPasswordError(true)
            flag = true
        }

        if (_input_password.current.value !== _input_confirm_password.current.value && _input_password.current.value !== '') {
            setSamePasswordError(true)
            flag = true
        }

        if (flag === false) {
            let axiosConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            }

            let Data = {
                username: _input_username.current.value,
                email: _input_email.current.value,
                password: _input_password.current.value
            }

            setUsername(_input_username.current.value)

            axios.post('https://akademia108.pl/api/social-app/user/signup',
                Data,
                axiosConfig)
                .then((res) => {
                    if (res.data.signedup === false) {
                        if (res.data.message.username !== undefined) {
                            setExistUsernameError(true);
                        }

                        if (res.data.message.email !== undefined) {
                            setExistEmailError(true);
                        }
                    } else {
                        setSigningUpSuccess(res.data.signedup)
                        setTimeout(() => {
                            window.location.href = "/social-app/Login"
                        },1000)
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }


    return (
        <div className="App">
            <Navbar />
            <div className="form-container">
                <form>
                    <h1>Sign Up</h1>
                    <div className="errors-container">
                        {emptyUsernameError && <p className="error">The username field is required.</p>}
                        {existUsernameError && <p className="error">The username has already been taken.</p>}
                        {emptyPasswordError && <p className="error">Passwords field is empty</p>}
                        {samePasswordError && <p className="error">Passwords must be the same</p>}
                        {specialPasswordError && <p className="error">Password must include specific charecter !#@$%)</p>}
                        {lengthPasswordError && <p className="error">Password must contain at least 6 charecters</p>}
                        {numberPasswordError && <p className="error">Password must contain at least one number</p>}
                        {emailError && <p className="error">The email field is required.</p>}
                        {notEmailError && <p className="error">Please provide an E-mail address.</p>}
                        {existEmailError && <p className="error">The email has already been taken.</p>}
                    </div>

                    <input type="text" placeholder="Username" ref={_input_username}></input>

                    <input type="email" placeholder="E-mail address" ref={_input_email}></input>


                    <div className="password-inputs">
                        <input type={passwordVisability} placeholder="Password" ref={_input_password}></input><span onClick={showPassword}><FontAwesomeIcon icon={regular('eye')}></FontAwesomeIcon></span>
                    </div>

                    <div className="password-inputs">
                        <input type={passwordConfirmationVisability} placeholder="Confirm Password" ref={_input_confirm_password}></input><span onClick={showPasswordConfirmation}><FontAwesomeIcon icon={regular('eye')}></FontAwesomeIcon></span>
                    </div>

                    <button type="submit" onClick={signUpFunction}>Sign Up</button>
                    {signingUpSuccess && <h3>Success! Hello, {username}</h3>}
                </form>
            </div>
        </div>
    )
}