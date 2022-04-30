import '../style/rec.css'

import React, { useEffect, useState } from "react";
import axios from "axios";

const Rec = (props) => {

    const [recUsers, setRecUsers] = useState([])

    const recUpdate = () => {
        let Data = ''

        axios.post('https://akademia108.pl/api/social-app/follows/recommendations',
            Data,
            props.axiosConfig)
            .then((res) => {
                setRecUsers(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {

        recUpdate()

    }, [])


    //FOLLOWING FUNCTION 
    const follow = (userId) => {

        let Data = {
            leader_id: userId
        }

        axios.post('https://akademia108.pl/api/social-app/follows/follow',
            Data,
            props.axiosConfig)
            .then(() => {
                recUpdate()
                console.log('follow')
                props.subscriprionsUpdate()
                props.updatePosts()
            })
            .catch((err) => {
                console.log("AXIOS ERROR: ", err);
            });
    }

    let Recommendations = recUsers.map((user) => {
        return (
            <div className="rec-user-container" key={user.id}>
                <div className="rec-user" >
                    <img src={user.avatar_url} alt='avatar'></img>
                    <p className="username">{user.username}</p>
                    <button type="button" onClick={() => {follow(user.id)}}>Follow</button>
                </div>
            </div>
        )
    })

    return (
        <div>
            <div className="rec-container-outside">
            <h1>Recommendations</h1>
                {Recommendations}
            </div>
        </div>

    )
}

export default Rec;