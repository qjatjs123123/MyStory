import axios from 'axios';
import React, { useState, useEffect,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
function ProfileBox(props){
  const profileref = useRef('');
  const [bbsCount, setbbsCount] = useState('');
  const [followCount, setfollowCount] = useState('');
  const [isfollow, setisfollow] = useState(false);
  const navigate = useNavigate();
  const tabData = ["clock", "heart", "follow"];
  useEffect(() => {
    getProfileinfoSubmit()
    if (profileref.current != '')
      profileref.current.style.background = `url(${props.info.userProfile}) no-repeat center center / contain`       
  }, [isfollow])
  const getProfileinfoSubmit = () => {
    const url = "/profile/getProfileinfo";
    axios.post(url, {userID:props.info.userID}, { withCredentials: true })
      .then((resp)=>{
        setbbsCount(resp.data.bbscount);
        setfollowCount(resp.data.followcount);
        setisfollow(resp.data.isfollow);
      })  
  }

  const followSubmit = () => {
    const url = "/profile/follow";
    axios.post(url, {userID:props.info.userID}, { withCredentials: true })
      .then((resp)=>{
        if (resp.data == true) setisfollow(true)
        else alert("오류");
    })
  }
  const unfollowSubmit = () => {
    const url = "/profile/unfollow";
    axios.post(url, {userID:props.info.userID}, { withCredentials: true })
      .then((resp)=>{
        if (resp.data == true) setisfollow(false)
        else alert("오류");
    })
  }

  const followbuttonhandler = () => {

    if (isfollow === true){
      return  <div onClick={unfollowSubmit} style={{transform:'translateY(-8px)'}} className='unfollow-button'>언팔로우</div>
    }else if(isfollow === false){
      return <div onClick={followSubmit} style={{transform:'translateY(-8px)'}} className='follow-button'>팔로우</div>
    }else{
      return <div></div>
    }
  }

  return(
    <div className='profilebox-outter'>
      <div className='profilebox-inner' >
        <div ref={profileref} className='profilebox-image' onClick={() => navigate(`/Profile/${props.info.userID}`)}></div>
        
        <div className='profilebox-state' onClick={() => navigate(`/Profile/${props.info.userID}`)}>
          <div  className="message-title">상태메시지</div>
          <div>
            {props.info.userState}
          </div>    
        </div>
        <div className='profilebox-info-container'>
          <div className='profilebox-info'>{bbsCount}개의 글</div>
          {followbuttonhandler()}     
        </div>
        <div className='profilebox-nickname'>
          <span>by</span> {props.info.userID}({props.info.userNickname})
          </div>
        <div className="like-info">
          <span>
            <i className="fa fa-heart"></i>
          </span>
          <span>
            {followCount}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProfileBox;