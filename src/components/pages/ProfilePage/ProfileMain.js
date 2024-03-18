import React, { useState, useEffect,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProfileBox from './ProfileBox';
import ProfileTab from './ProfileTab';
import BoardMain from '../boardmainPage/BoardMain';
import BoardWrite from '../boardwritePage/BoardWrite';
import BoardWriteModal from '../boardwritePage/BoardWriteModal';
import ProfileDropBox from './ProfileDropBox';
import e from 'cors';
import BoardFlex from '../boardmainPage/BoardFlex';
import HistoryPage from '../historyPage/HistoryPage';

function ProfileMain(props){
  //userInfo
  const [userNickname, setuserNickname] = useState('');
  const [userState, setuserState] = useState('');
  const [userProfile, setuserProfile] = useState('');
  const [isLogin, setLogin] = useState(false);  //로그인 확인
  const [curtab, setcurtab] = useState(props.curtab)
  const [userProfileList, setuserProfileList]  = useState([]);
  const [curpage, setPage] = useState(0);  //현재 페이지
  const [userID, setUserID] = useState(false);
  const profileref = useRef('');
  const tabbarref = useRef('');
  const navigate = useNavigate();
  const infiniteScrollRef = useRef(null);
  const tabData = props.tabData;
  // const tabData = ["clock", "heart","board","myboard", "follow","write"];
  const [curdropbox, setcurdropbox] = useState(props.ishome ? '제목' : '아이디');
  const [input, setinput] = useState('')
  const firstRender = useRef(true);
  const flg  = useRef(false);
  const count = useRef(0);
  
  let tmparr = useRef([]);
  //board render
  
  let event = null;
  useEffect(() => {
    // if (profileref.current != '')
    //   profileref.current.style.background = `url(${userProfile}) no-repeat center center / cover`       
  }, [userProfile])

  useEffect(() => {
      
        loginCheckSubmit();  
        if(props.ishome) return 
        infiniteScrollRef.current = infiniteScroll
        document.addEventListener('scroll', infiniteScrollRef.current);   
        infiniteScroll();
        return () => document.removeEventListener('scroll', infiniteScrollRef.current) ;
      
  }, []);

  useEffect(() =>{
    if (props.userID == null) return
    setcurtab("home")
    setPage(0);
    tabBarhandle("home");
  }, [props.userID])



  useEffect(() => { 
    if (curpage >= 15 ){
     // document.removeEventListener('scroll', infiniteScrollRef.current); 
     return;
    }
    
    profileSubmit();
  }, [curpage]);

  useEffect(() => {
    if (firstRender.current || curtab == 'follow') {
      return;
  }

    flg.current = false;
    tmparr.current = new Array();
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
    
  }, [userProfileList,props.userID])


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
        console.log(resp.data);
        count.current =  Math.ceil(resp.data.count / 12);
        let newContents = Array.from(tmparr.current);
        resp.data.rows.forEach((e) => {
            newContents.push(e);
            tmparr.current.push(e)
        })

        flg.current = true;
        if (resp.data.rows.length == 0 && userProfileList.length == 0){
          return;
        }  
        setuserProfileList(newContents);

        // 초기 마운트 시에는 실행하지 않음
        firstRender.current = false;
        
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
                  console.log(response.data);
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

    tabData.forEach((item, idx)=>{
      if (item === tab){
        tabbarref.current.style.marginLeft = `${idx*130}px`;
      }
      if (tab === 'myboard' || tab === 'home') setcurdropbox('제목');
      else setcurdropbox('아이디');
    })

    const searchinput = document.querySelector(".search-input")
    if (tab !== "write" && searchinput != null ) document.querySelector(".search-input").value = '';
    setinput('');
    setcurtab(tab)
  }

  
  const tabhandler = () => {
    if (curtab === 'clock') return userProfileList.length > 0  ? userProfileList.map((info, idx) => (
      <ProfileBox key={idx} info={info} />)) : flg.current ? <div style={{fontSize:'25px', color:'gray'}}>검색 결과가 없습니다.</div> : <div></div>;
    else if(curtab === 'home') return <BoardFlex  curtag={'전체보기'} setinput={setinput} userProfileList={userProfileList} userID={props.userID} option={curdropbox} input={input} curtab={"myboard"}/>
    else if(curtab === 'board') return <BoardMain userID={props.userID} option={curdropbox} input={input} curtab={curtab} />
    else if(curtab === 'myboard') return <BoardMain userID={props.userID} option={curdropbox} input={input} curtab={curtab} />
    else if(curtab === 'follow') return <HistoryPage userID={props.userID} input={input}/>
    else if(curtab === 'write') return <BoardWrite tabBarhandle={tabBarhandle}  update={false} bbsID={''} bbsTitle={''} bbsContent={''}/>

  }
  const dropboxhandler = () => {
    if (curtab === 'clock') return <ProfileDropBox curdropbox={curdropbox} arr={['아이디']} curtab={curtab} condselectSubmit={condselectSubmit}/>
    else if(curtab === 'heart') return <ProfileDropBox curdropbox={curdropbox} arr={['아이디']} curtab={curtab} condselectSubmit={condselectSubmit}/>
    else if(curtab === 'board' ) return <ProfileDropBox curdropbox={curdropbox} arr={['아이디', '제목', '해시태그']} curtab={curtab} condselectSubmit={condselectSubmit} />
    else if(curtab === 'myboard') return <ProfileDropBox curdropbox={curdropbox} arr={[ '제목', '해시태그']} curtab={curtab}  condselectSubmit={condselectSubmit}/> 
    else if(curtab === 'follow') return <ProfileDropBox curdropbox={curdropbox} arr={['아이디']} curtab={curtab} condselectSubmit={condselectSubmit}/>
    else if(curtab === 'home') return <ProfileDropBox curdropbox={curdropbox} arr={['제목']} curtab={curtab} condselectSubmit={condselectSubmit}/>
    else  return <ProfileDropBox curdropbox={curdropbox} arr={['아이디']} curtab={curtab} condselectSubmit={condselectSubmit}/>
  }
  
  const condselectSubmit = (val,option) => {
    setcurdropbox(option);
    setinput(val);
  }

  return (
    isLogin ? (
        <div style={{marginTop : props.ishome ? '0px' : null}} className='bbs-container'>
            {/* <div className='profile-container'>
                <div className='profile-content'>
                    <div className='profile' ref={profileref}></div>
                    <div className='profile-left'>
                        <div className='profile-nickname'><span>{userNickname}</span></div>
                        <div className='profile-state'><span>{userState}</span></div>
                    </div>
                </div>
            </div> */}
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