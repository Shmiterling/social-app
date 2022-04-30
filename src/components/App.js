import '../style/app.css';

import axios from 'axios';
import React from 'react';
import { useState, useEffect } from 'react';

import Navbar from './Navbar';
import PostFeed from './PostFeed';
import Form from './Form';
import PostAdd from './PostAdd';
import Rec from './Rec';


function App() {

  let showCloseButton = true;

  const [latestPosts, latestPostsUpdate] = useState([]);
  const [formDisplay, setFormDisplay] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

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

  //LOG IN POPUP FUNCTION

  const logInPopUp = () => {
    if (localStorage.jwt_token === undefined) {
      setTimeout(() => {
        setFormDisplay(true);
      }, 10000)
    };
  }


  useEffect(() => {

    updatePosts()

    subscriprionsUpdate()

    logInPopUp()

  }, [])


  //FEED BUILDING FUNCTION
  const updatePosts = () => {
    axios.post('https://akademia108.pl/api/social-app/post/latest',
      {},
      axiosConfig)
      .then((res) => {
        latestPostsUpdate(res.data);
      })
      .catch((err) => {
        console.log(err)
      })

    if (localStorage.jwt_token !== undefined) {
      setLoggedIn(true);
    };
  }



  //POST DELETING FUNCTION
  const postDelete = (post) => {

    let newFeed = latestPosts.filter((postToDelete) => {
      return postToDelete !== post
    })

    latestPostsUpdate(newFeed)

    let Data = {
      post_id: post.id
    }

    axios.post('https://akademia108.pl/api/social-app/post/delete',
      Data,
      axiosConfig)
      .catch((err) => {
        console.log(err)
      })
  };

  const [allFollowed, setAllFollows] = useState([]);

  //SUBSCRIPTIONS UPDATE FUNCTION
  const subscriprionsUpdate = () => {

    if (localStorage.jwt_token !== undefined) {
      let Data = '';
      axios.post('https://akademia108.pl/api/social-app/follows/allfollows',
        Data,
        axiosConfig)
        .then((res) => {
          setAllFollows(res.data)
        })
    }
  }

  //UNFOLLOWING FUNCTION
  const unfollow = (userId) => {

    let Data = {
      leader_id: userId
    }

    axios.post('https://akademia108.pl/api/social-app/follows/disfollow',
      Data,
      axiosConfig)
      .then((res) => {
        subscriprionsUpdate()
        updatePosts()
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
  }

  //FOLLOWING FUNCTION 
  const follow = (userId) => {

    let Data = {
      leader_id: userId
    }
    console.log('follow')
    axios.post('https://akademia108.pl/api/social-app/follows/follow',
      Data,
      axiosConfig)
      .then(() => {
        subscriprionsUpdate()
        updatePosts()
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
  }


  //LIKEDISLIKE FUNCTION
  const likeDislike = (postID, isLiked) => {

    if (loggedIn === true) {

      //FINDING THE POST TARGET
      let postsInFeedID = latestPosts.map((latestPost) => {
        return latestPost.id
      })

      let postIndex = postsInFeedID.indexOf(postID)

      let targetPost = latestPosts[postIndex];
      let targetLikes = targetPost.likes;

      //IS IT LIKED OR NOT
      if (isLiked === true) {
        let targetLikesID = targetLikes.map((likeObject) => {
          return likeObject.id
        })

        let indexToRemove = targetLikesID.indexOf(Number(localStorage.id))

        targetLikes.splice(indexToRemove, 1)
        let targetPostArray = [targetPost]


        let newLeftPart = latestPosts.slice(0, postIndex)
        let newRightPart = latestPosts.slice(postIndex + 1, latestPosts.length)
        let newLatestPosts = newLeftPart.concat(targetPostArray.concat(newRightPart))

        latestPostsUpdate(newLatestPosts)


        let Data = {
          post_id: postID
        }

        axios.post('https://akademia108.pl/api/social-app/post/dislike',
          Data,
          axiosConfig)
          .catch((err) => {
            console.log(err)
          })

      } else {
        let newObject = {
          id: Number(localStorage.id)
        }
        targetLikes.push(newObject);
        let targetPostArray = [targetPost]

        let newLeftPart = latestPosts.slice(0, postIndex)
        let newRightPart = latestPosts.slice(postIndex + 1, latestPosts.length)
        let newLatestPosts = newLeftPart.concat(targetPostArray.concat(newRightPart))

        latestPostsUpdate(newLatestPosts)

        let Data = {
          post_id: postID
        }

        axios.post('https://akademia108.pl/api/social-app/post/like',
          Data,
          axiosConfig)
          .catch((err) => {
            console.log(err)
          })
          
      }

    }

  }


  return (
    <div className="App">
      <Navbar />
      <div className='content-container' >
        {loggedIn && <PostAdd latestPostsUpdate={latestPostsUpdate} latestPosts={latestPosts} axiosConfig={axiosConfig} />}
        {loggedIn && <Rec axiosConfig={axiosConfig} subscriprionsUpdate={subscriprionsUpdate} updatePosts={updatePosts}/>}
        <PostFeed likeDislike={likeDislike} allFollowed={allFollowed} follow={follow} unfollow={unfollow} postDelete={postDelete} latestPosts={latestPosts} latestPostsUpdate={latestPostsUpdate} axiosConfig={axiosConfig} loggedIn={loggedIn} />
      </div>
      {formDisplay && <Form showCloseButton={showCloseButton} setFormDisplay={setFormDisplay} />}
    </div>
  );
}

export default App;
