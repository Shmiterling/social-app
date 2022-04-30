import React from 'react';
import { createRoot } from 'react-dom/client';
import './style/index.css';
import App from './/components/App';
import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import AllFollowed from './components/AllFollowed';

import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
TimeAgo.addDefaultLocale(en);


const container = document.getElementById('root');
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/social-app" element={<App />} />
        <Route path="/social-app/Login" element={<Login />} />
        <Route path="/social-app/SignUp" element={<SignUp />} />
        <Route path="/social-app/AllFollowed" element={<AllFollowed />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
