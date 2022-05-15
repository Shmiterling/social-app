import '../style/postfeed.css'

import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid, regular} from '@fortawesome/fontawesome-svg-core/import.macro';
import ReactTimeAgo from 'react-time-ago';
import axios from "axios";


const PostFeed = (props) => {

    
    let latestPosts = props.latestPosts;
    let loggedIn = props.loggedIn


    const olderPosts = () => {

        let lastPostDate = {
            date: latestPosts[latestPosts.length - 1].created_at
        }

        axios.post('https://akademia108.pl/api/social-app/post/older-then',
            lastPostDate,
            props.axiosConfig)
            .then((res) => {
                let newFeed = latestPosts.concat(res.data)
                props.latestPostsUpdate(newFeed)
            })
            .catch((err) => {
                console.log("AXIOS ERROR: ", err);
            });

        setNewPostDownloadFlag(false)
    }

    //---------------------------------------------------------------------



    //UP BUTTON FUCNTION
    let doc = document.documentElement;
    const [upButtonFlag, setUpButtonFlag] = useState(false);
    const visabilityButtonCheck = () => {
        if (doc.scrollTop >= doc.clientHeight) {
            setUpButtonFlag(true)
        } else {
            setUpButtonFlag(false)
        }
    }

    const upFunction = () => {
        doc.scrollIntoView({ behavior: 'smooth' })
    }

    window.onscroll = () => {
        visabilityButtonCheck()
    }
    
    //---------------------------------------------------------------------




    //INFINITE SCROLL FUNCTION
    const containerRef = useRef(null);
    const [newPostsDownloadFlag, setNewPostDownloadFlag] = useState(false);
    
    
    useEffect(() => {
        const options = {
            root: null,
            rootMargin: "0px",
            threshold: 1.0
        }
        const createObserver = () => {
            const observer = new IntersectionObserver(infiniteScroll, options)
            observer.observe(containerRef.current)
        }
        setTimeout(createObserver, 2000)
    }, [])

    const infiniteScroll = (entries) => {
        const [entry] = entries
        setNewPostDownloadFlag(entry.isIntersecting)
    }

    if (newPostsDownloadFlag === true) {
        olderPosts()
    }

    //---------------------------------------------------------------------



    //CREATING FEED
    let Feed = latestPosts.map((latestPost) => {

        //IS POST MINE CHECK
        let flag = false;

        if (localStorage.jwt_token === undefined) {
            flag = false;
        } else if (Number(latestPost.user.id) === Number(localStorage.id)) {
            flag = true;
        }


        //FOLLOW CHECK
        let allFollowedUsersID = props.allFollowed.map((followedUser) => {
            return Number(followedUser.id)
        })

        const isFollowingCheck = (array) => {
            if (array.includes(latestPost.user.id)) {
                return true
            } else {
                return false
            }
        }

        let isFollowed = isFollowingCheck(allFollowedUsersID)


        //LIKES CHECK
        let likesData = latestPost.likes
        let likesUsersIDs = likesData.map((likeData) => {
            return likeData.id
        })


        const isLikedCheck = (array) => {
            if (array.includes(Number(localStorage.id))) {
                return true;
            } else {
                return false;
            }
        }

        let isLiked = isLikedCheck(likesUsersIDs);

        //DATE CONVERTING
        let newDate = new Date(latestPost.created_at)
        let formattedDate = (newDate.getTime())

        return (
            <div className="Post" key={latestPost.id}>
                <span className="username">
                    {latestPost.user.username}
                    {(!flag && loggedIn) && <span className="sub-container">
                        {isFollowed || <span className="subscribtion" onClick={() => props.follow(latestPost.user.id)}>Follow</span>}
                        {isFollowed && <span className="subscribtion" onClick={() => props.unfollow(latestPost.user.id)}>Unfollow</span>}
                    </span>}
                </span>
                {flag && loggedIn && <span onClick={() => props.postDelete(latestPost)}><FontAwesomeIcon className='delete-icon' icon={regular('trash-can')} /></span>}
                <div className="avatar"><img src={latestPost.user.avatar_url} alt="avatar"></img></div>
                <p className="content">{latestPost.content}</p>

                {isLiked && <p className="likes" onClick={() => { props.likeDislike(latestPost.id, isLiked) }}><FontAwesomeIcon icon={solid('heart')} />{latestPost.likes.length}</p>}
                {isLiked || <p className="likes" onClick={() => { props.likeDislike(latestPost.id, isLiked) }} ><FontAwesomeIcon icon={regular('heart')} />{latestPost.likes.length}</p>}

                <p className="date"><ReactTimeAgo date={formattedDate} locale='en-Us' timeStyle='round' /></p>
            </div>

        )
    })

    return (
        <div>
            <div className="Feed">
                {upButtonFlag && <span className='up-button' onClick={upFunction} ><FontAwesomeIcon icon={solid('angle-up')} /></span>}
                {Feed}
                <div ref={containerRef}></div>
            </div>
        </div>

    )
}

export default PostFeed;