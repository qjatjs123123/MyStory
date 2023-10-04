import React, { useState, useEffect,useRef } from 'react';

function ProfileBox(props){

  const profileref = useRef('');

  const tabData = ["clock", "heart", "follow"];
  useEffect(() => {
    if (profileref.current != '')
      profileref.current.style.background = `url(${props.info.userProfile}) no-repeat center center / contain`       
  }, [])

  return(
    <div className='profilebox-outter'>
      <div className='profilebox-inner'>
        <div ref={profileref} className='profilebox-image'></div>
        
        <div className='profilebox-state'>
          <div className="message-title">상태메시지</div>
          <div>
            {props.info.userState}
          </div>    
        </div>
        <div className='profilebox-info'>8개의 댓글</div>
        <div className='profilebox-nickname'>
          by <span>{props.info.userID}({props.info.userNickname})</span>
          </div>
        <div className="like-info">
          <span>
            <i className="fa fa-heart"></i>
          </span>
          <span>
            30
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProfileBox;