import React, { useState, useEffect,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProfileBox from './ProfileBox';
import ProfileTab from './ProfileTab';
import BoardMain from '../boardmainPage/BoardMain';
import BoardWrite from '../boardwritePage/BoardWrite';
import BoardWriteModal from '../boardwritePage/BoardWriteModal';
import ProfileDropBox from './ProfileDropBox';

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
  const [curdropbox, setcurdropbox] = useState('아이디');
  const [input, setinput] = useState('')
  const [flg, setflg] = useState(false)
  const firstRender = useRef(true);
  const count = useRef(0);
  //board render
  
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
    if (curpage >= 15){
     // document.removeEventListener('scroll', infiniteScrollRef.current); 
     return;
    }
    profileSubmit();
  }, [curpage]);

  useEffect(() => {
    if (firstRender.current) {
      return;
  }

    setuserProfileList([])
  }, [input])

  useEffect(() => {
    if (firstRender.current) {
      return;
  }

    if (userProfileList.length == 0){
      if (curpage != 0){
        setPage(0);
      }
      else{
        profileSubmit();
      }
    }
  }, [userProfileList])


  const infiniteScroll = () => {
    event = this;
    const { scrollHeight } = document.documentElement;
    const { scrollTop } = (document.documentElement);
    const { clientHeight } = document.documentElement;
    if (scrollTop === 0) return
    let y = Math.ceil(scrollTop);
    if ((scrollHeight - clientHeight) - y <= 150){
      setPage((curpage) => {
        if (curpage < Math.min(count.current-1,14)) {
          return curpage + 1; // 업데이트된 값을 반환하여 setPage로 전달
        } else {
          return curpage; // 아무런 변경 없이 현재 값을 반환
        }
      });
      
    }
}

  const profileSubmit = () => {
    const url = '/profile/getProfile';
    const data = {
      curpage: curpage,
      input:input
    }
    axios.post(url, data, { withCredentials: true })
      .then((resp) => {
        count.current =  Math.ceil(resp.data.count / 12);
        let newContents = Array.from(userProfileList);
        resp.data.rows.forEach((e) => {
            newContents.push(e);
        })
        if (resp.data.rows.length == 0 && userProfileList.length == 0) return;   
        setuserProfileList(newContents);
        // 초기 마운트 시에는 실행하지 않음
        firstRender.current = false;
        console.log("1");
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

  
  const tabhandler = () => {
    
    if (curtab === 'clock') return userProfileList.map((info, idx) => (
      <ProfileBox key={idx} info={info} />));
    else if(curtab === 'heart') return
    else if(curtab === 'board') return <BoardMain option={curdropbox} input={input} curtab={curtab} />
    else if(curtab === 'myboard') return <BoardMain option={curdropbox} input={input} curtab={curtab} />
    else if(curtab === 'follow') return
    else if(curtab === 'write') return <BoardWrite tabBarhandle={tabBarhandle}  update={false} bbsID={''} bbsTitle={''} bbsContent={''}/>

  }
  const dropboxhandler = () => {
    if (curtab === 'clock') return <ProfileDropBox arr={['아이디']} curtab={curtab} condselectSubmit={condselectSubmit}/>
    else if(curtab === 'heart') return <ProfileDropBox arr={['아이디']} curtab={curtab} condselectSubmit={condselectSubmit}/>
    else if(curtab === 'board') return <ProfileDropBox arr={['아이디', '제목', '해시태그']} curtab={curtab} condselectSubmit={condselectSubmit} />
    else if(curtab === 'myboard') return <ProfileDropBox arr={[ '제목', '해시태그']} curtab={curtab}  condselectSubmit={condselectSubmit}/> 
    else if(curtab === 'follow') return <ProfileDropBox arr={['아이디']} curtab={curtab} condselectSubmit={condselectSubmit}/>
  }
  
  const condselectSubmit = (e,option) => {
    setcurdropbox(option);
    setinput(e.target.value);
    
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
                  {dropboxhandler()}
                  
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