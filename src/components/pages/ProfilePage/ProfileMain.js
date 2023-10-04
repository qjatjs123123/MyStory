import React, { useState, useEffect,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProfileBox from './ProfileBox';
import ProfileTab from './ProfileTab';
import BoardMain from '../boardmainPage/BoardMain';
import BoardWrite from '../boardwritePage/BoardWrite';
import BoardWriteModal from '../boardwritePage/BoardWriteModal';

function ProfileMain(){
  //userInfo
  const [userNickname, setuserNickname] = useState('');
  const [userState, setuserState] = useState('');
  const [userProfile, setuserProfile] = useState('');
  const [isLogin, setLogin] = useState(false);  //로그인 확인
  const [curtab, setcurtab] = useState('clock')
  const [userProfileList, setuserProfileList]  = useState([]);
  const [curpage, setPage] = useState(0);  //현재 페이지
  const profileref = useRef('');
  const tabbarref = useRef('');
  const navigate = useNavigate();
  const infiniteScrollRef = useRef(null);
  const tabData = ["clock", "heart","board","myboard", "follow","write"];
  let event = null;
  useEffect(() => {
    if (profileref.current != '')
      profileref.current.style.background = `url(${userProfile}) no-repeat center center / cover`       
  }, [userProfile])

  useEffect(() => {   
      loginCheckSubmit();    
      infiniteScrollRef.current = infiniteScroll
      document.addEventListener('scroll', infiniteScrollRef.current);   

      infiniteScroll();
      return () => document.removeEventListener('scroll', infiniteScrollRef.current) ;
  }, []);

  useEffect(() => {  

    if (curpage >= 15){document.removeEventListener('scroll', infiniteScrollRef.current); }
    profileSubmit();
    
  }, [curpage]);

  const infiniteScroll = () => {
    event = this;
    const { scrollHeight } = document.documentElement;
    const { scrollTop } = (document.documentElement);
    const { clientHeight } = document.documentElement;
    if (scrollTop === 0) return
    let y = Math.ceil(scrollTop);
    if ((scrollHeight - clientHeight) - y <= 150){
      setPage((curpage) => curpage + 1);
    }
}

  const profileSubmit = () => {
    const url = '/profile/getProfile';
    const data = {curpage: curpage}
    axios.post(url, data, { withCredentials: true })
      .then((resp) => {
        let newContents = Array.from(userProfileList);
        resp.data.forEach((e) => {
            newContents.push(e);
        })      
        setuserProfileList(newContents);
      })
  }

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
    else if(tab === "board") tabbarref.current.style.marginLeft = '260px';
    else if(tab === "myboard") tabbarref.current.style.marginLeft = '390px';
    else if(tab === "follow") tabbarref.current.style.marginLeft = '520px';
    else  tabbarref.current.style.marginLeft = '650px';
    setcurtab(tab)
  }

  const focushandler = (e) => {
    e.target.parentElement.querySelector('.fa').style.color="black";
    e.target.parentElement.style.border="2px solid black"
  }
  const blurhandler = (e) => {
    e.target.parentElement.querySelector('.fa').style.color="#adb5bd";
    e.target.parentElement.style.border="2px solid #adb5bd"
  }
  
  const tabhandler = () => {
    if (curtab === 'clock') return userProfileList.map((info, idx) => (
      <ProfileBox key={idx} info={info} />));
    else if(curtab === 'heart') return
    else if(curtab === 'board') return <BoardMain/>
    else if(curtab === 'myboard') return 
    else if(curtab === 'myfollow') return
    else if(curtab === 'write') return <BoardWrite tabBarhandle={tabBarhandle}  update={false} bbsID={''} bbsTitle={''} bbsContent={''}/>

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
                  {tabData.map((type, idx) => {
                    return <ProfileTab key={idx} curtab={curtab} tabBarhandle={tabBarhandle} type={type}/>
                  })}
                  <div className='tab-search-container'>
                  <i className="fa fa-search"></i>
                  <input onFocus={focushandler} onBlur={blurhandler} placeholder='아이디를 입력하세요' className='search-input'></input>
                  </div>
                </div>
                <div ref={tabbarref} className='tab-bar'></div>
              </div>
              <div className='user-container'>
                {tabhandler()}
                
              </div>
            </div>
        </div>
        ) : (<div></div>)
  )
}

export default ProfileMain;