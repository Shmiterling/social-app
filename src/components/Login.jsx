import axios from 'axios';
import React from 'react';
import { useState } from 'react';

import Navbar from "./Navbar"
import Form from "./Form"

export default function Login() {

    let showCloseButton = false;

    return (
        <div className="App">
            <Navbar />
            <Form showCloseButton={showCloseButton} />
        </div>
    )
}