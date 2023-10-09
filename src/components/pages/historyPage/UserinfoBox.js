import axios from "axios";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UserinfoBox(props){
  const [isfollow, setisfollow] = useState(true);
  const navigate = useNavigate();
  const unfollowSubmit = () => {
    const url = "/profile/unfollow";
    axios.post(url, {userID:props.data.userID}, { withCredentials: true })
      .then((resp)=>{
        if (resp.data == true) setisfollow(false)
        else alert("오류");
    })
  }
  return (
    isfollow ? 
    <div className='follow-info-container'>
      <div className='follow-info-container-inner' >
          <img  onClick={() => navigate(`/Profile/${props.data.userID}`)} className="follow-info-img1" src={props.data.userProfile}></img>
        
        <div className='follow-info-box'>
          <div onClick={() => navigate(`/Profile/${props.data.userID}`)} className='follow-info-box-title'>
            <span>{props.data.userID}</span> 
          </div>
          <div className='follow-info-box-content'>
            {props.data.userState}
          </div>
        </div>
        <div onClick={unfollowSubmit} className='follow-info-box-btn'>
          언팔로우
        </div>
      </div>
    </div>
    : <></>
  )
}

export default UserinfoBox;