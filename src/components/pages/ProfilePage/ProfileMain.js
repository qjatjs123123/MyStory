import React, { useState, useEffect,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProfileBox from './ProfileBox';
import ProfileTab from './ProfileTab';

function ProfileMain(){
  //userInfo
  const [userNickname, setuserNickname] = useState('');
  const [userState, setuserState] = useState('');
  const [userProfile, setuserProfile] = useState('');
  const [isLogin, setLogin] = useState(false);  //로그인 확인
  const [curtab, setcurtab] = useState('clock')
  const profileref = useRef('');
  const tabbarref = useRef('');
  const navigate = useNavigate();
  const tabData = ["clock", "heart", "follow"];
  useEffect(() => {
    if (profileref.current != '')
      profileref.current.style.background = `url(${userProfile}) no-repeat center center / 100% 100%`       
  }, [userProfile])

  useEffect(() => {   
      loginCheckSubmit();    
  }, []);

  const loginCheck = () => {
    const url = '/board/loginCheck';
    const data = {};
    return axios.post(url, data, { withCredentials: true });
  }
  const loginCheckSubmit = () => {
      loginCheck()
          .then((response) => {
              if (response.data === false) {
                  setLogin(false);
                  alert("다시 로그인 해주세요");
                  navigate('/Main');
              }
              else {
                  setuserNickname(response.data.userNickname);
                  setuserState(response.data.userState);
                  setuserProfile(response.data.userProfile);        
                  setLogin(true);
              }
          })
  }

  const tabBarhandle = (tab) => {
    if (tab === 'clock') tabbarref.current.style.marginLeft = '0px';
    else if(tab === 'heart') tabbarref.current.style.marginLeft = '130px';
    else tabbarref.current.style.marginLeft = '260px';

    setcurtab(tab)
  }

  return (
    isLogin ? (
        <div className='bbs-container'>
            <div className='profile-container'>
                <div className='profile-content'>
                    <div className='profile' ref={profileref}></div>
                    <div className='profile-left'>
                        <div className='profile-nickname'><span>{userNickname}</span></div>
                        <div className='profile-state'><span>{userState}</span></div>
                    </div>
                </div>
            </div>
            <div className='user-wrapper'>
              <div className='user-tabs'>
                <div className='tabs'>
                  {tabData.map((type) => {
                    return <ProfileTab curtab={curtab} tabBarhandle={tabBarhandle} type={type}/>
                  })}
                </div>
                <div ref={tabbarref} className='tab-bar'></div>
              </div>
              <div className='user-container'>
                
                <ProfileBox />
                <ProfileBox />
                <ProfileBox />
                <ProfileBox />
                <ProfileBox />
                <ProfileBox />
                <ProfileBox />
                <ProfileBox />
                <ProfileBox />
              </div>
            </div>
        </div>
        ) : (<div></div>)
  )
}

export default ProfileMain;