import '../style/postadd.css'

import axios from "axios";
import React from "react";

const PostAdd = (props) => {

    let latestPosts = props.latestPosts;
    let _inputText = React.createRef();

    const addPost = (event) => {
        event.preventDefault()

        let firstDateData = {
            date: latestPosts[0].created_at
        }

        let Data = {
            content: _inputText.current.value
        }

        axios.post(' https://akademia108.pl/api/social-app/post/add',
        Data,
        props.axiosConfig)
        .then((res) => {
            axios.post('https://akademia108.pl/api/social-app/post/newer-then',
            firstDateData,
            props.axiosConfig)
            .then((res) => {
                let newerPosts = res.data
                props.latestPostsUpdate(newerPosts.concat(props.latestPosts))
                _inputText.current.value = ''
            })
            .catch((err) => {
                console.log(err)
            })
        })
   

        
    }


    return (
        <div className="container">
            <textarea placeholder="Your message..." ref={_inputText}></textarea>
            <button type='submit' onClick={addPost}>Add Post</button>
        </div>

    )
}

export default PostAdd;