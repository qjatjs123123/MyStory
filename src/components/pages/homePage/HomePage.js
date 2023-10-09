import axios from 'axios';
import React, { useState, useEffect,useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProfileTab from '../ProfilePage/ProfileTab';
import ProfileMain from '../ProfilePage/ProfileMain';

function HomePage(){
  const { userID } = useParams();
  const [userNickname, setuserNickname] = useState('');
  const [userState, setuserState] = useState('');
  const [userProfile, setuserProfile] = useState('');
  const [isLogin, setLogin] = useState(false);  //로그인 확인
  const profileref = useRef('');
  const navigate = useNavigate();
  const [tabData, settabData] = useState([]);
  useEffect(()=>{
    loginCheckSubmit();
  },[userID])
  useEffect(() => {
    if (profileref.current != '')
      profileref.current.style.background = `url(${userProfile}) no-repeat center center / cover`   ;
      
  }, [userProfile])
  const loginCheck = () => {
    const url = '/profile/userIDprofile';
    const data = {userID: userID};
    return axios.post(url, data, { withCredentials: true });
  }
  const loginCheckSubmit = () => {
    loginCheck()
      .then((response) => {
        if (response.data === false) {
            alert("오류");
            navigate('/Main');
        }
        else {
          setuserNickname(response.data.rows[0].userNickname);
          setuserState(response.data.rows[0].userState);
          setuserProfile(response.data.rows[0].userProfile);  
          if (response.data.rows[0].userID == response.data.userID)
            settabData(["home", "myboard","follow","write"]);
          else
            settabData(["home", "myboard"]);
        } 
      })
  }
  
  return (
    <div className='bbs-container'>
      <div className='profile-container'>
          <div className='profile-content'>
              <div className='profile' ref={profileref}></div>
              <div className='profile-left'>
                  <div className='profile-nickname'> {userNickname}
                  </div>
                  <div className='profile-state'>
                    {userState}
                  </div>
              </div>
          </div>
      </div>
      <ProfileMain ishome={true} tabData ={tabData} userID={userID} curtab={"home"}/>
            
    </div>
  );
}
export default HomePage;