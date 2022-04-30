import '../style/allfollowed.css'

import React, { useEffect, useState } from "react";

import axios from "axios";
import Navbar from "./Navbar";

const AllFollowed = () => {

  const [allFollowed, setAllFollowed] = useState([]);

  let axiosConfig;

  if (localStorage.jwt_token === undefined) {
    axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    }
  } else {
    axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.jwt_token,
      }
    }
  }

  useEffect(() => {
    subscriprionsUpdate()
  }, [])

  //SUBSCRIPTIONS UPDATE FUNCTION
  const subscriprionsUpdate = () => {

    if (localStorage.jwt_token !== undefined) {
      let Data = '';
      axios.post('https://akademia108.pl/api/social-app/follows/allfollows',
        Data,
        axiosConfig)
        .then((res) => {
          setAllFollowed(res.data)
        })
    }
  }



  const unfollow = (userId) => {

    let Data = {
      leader_id: userId
    }

    axios.post('https://akademia108.pl/api/social-app/follows/disfollow',
      Data,
      axiosConfig)
      .then((res) => {
        subscriprionsUpdate()
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
  }


  let Followed = allFollowed.map((user) => {
    return (
      <div className="user-container" key={user.id}>
        <img className="avatar" src={user.avatar_url} alt="avatar"></img>
        <p className="username">{user.username}</p>
        <button type="button" onClick={() => {unfollow(user.id)}}>Unfollow</button>
      </div>
    )
  })

  return (
    <div>
      <Navbar />
      <div className="container">
        {Followed}
      </div>
    </div>

  )
}

export default AllFollowed;