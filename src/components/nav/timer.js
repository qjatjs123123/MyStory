
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import React, {  useState ,useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Timer(props) {
    const [count, setCount] = useState(0);
    const [min, setMin] = useState(0);
    const [sec, setSec] = useState(0);
    const time = useRef(1800);
    const timerId = useRef(null);
    const navigate = useNavigate();
    const [active, setactive] = useState(false);
    const dropboxcontent_bbs = ['내 스토리','마이페이지' ,'연장','로그아웃']
    const [img, setimg] = useState('');
    const cur_hour = useRef(0);
    const cur_minute = useRef(0);
    const cur_second = useRef(0);
    const userID = useRef('')
    useEffect(() => {
        // 컴포넌트가 마운트될 때 이벤트 리스너를 추가합니다.
        document.body.addEventListener('click', handleBodyClick);
        getProfileImage();
        // 컴포넌트가 언마운트될 때 이벤트 리스너를 제거합니다.
        return () => {
          document.body.removeEventListener('click', handleBodyClick);
        };
    }, []); // 빈 배열은 컴포넌트가 마운트될 때 한 번만 실행됨을 의미합니다.

    const getProfileImage = () => {
        const url = '/profile/getProfileImage';
        const data = {
            userID : props.userID
        }
        axios.post(url, data,{ withCredentials: true })
            .then((resp)=>{
                if (resp.data.length > 0)
                    setimg(resp.data[0].userProfile);
                    userID.current = resp.data[0].userID
            })
    }

    const handleBodyClick = (e) => {
        // body 태그가 클릭될 때 실행할 코드를 작성합니다.

        setactive(false);
      };
    const getTimer = () => {      
        const url = '/board/getTimer';
        const data = {};
        return axios.post(url, data,{ withCredentials: true });
    }

    const getTimerSubmit = () => {
        getTimer()
            .then((response) => {
                const date = new Date(response.data.userLoginTime)
                if (response.data === 'logout') return;
                
                timerId.current = setInterval(() => {
                    const now = new Date();            
                    const cur_time = parseInt((now-date) / 1000);
                    time.current = 1800 - cur_time;
                    if (time.current >= 0) {
                        setMin(parseInt(time.current/60));
                        setSec(time.current%60);
                        time.current -= 1;
                    }
                    else{
                        setMin(0);
                        setSec(0);
                    }
                }, 1000);
            }) 
    }
    
    useEffect(() => {      
        getTimerSubmit();
        getProfileImage();
        return () => clearInterval(timerId.current)
    }, [props.count,count])

    useEffect(() => {
        if(time.current+1 <= 0){
            alert("다시 로그인 해주세요");
            clearInterval(timerId.current);
            navigate('/Main');
        }
    }, [sec]);

    const refreshToken = () => {
        const url = '/member/refreshToken';
        const data = {};
        return axios.post(url, data,{ withCredentials: true });
    }

    const refreshTokenSubmit = () => {
        refreshToken()
            .then( (response) => {
                if (response.data === false){
                    alert("다시 로그인 해주세요");
                    navigate('/Main');
                }
                
                setCount(count +1);
            })
    }

    const logout = () => {
        const url = '/member/logout';
        const data = {};
        return axios.post(url, data,{ withCredentials: true });
    }

    const logoutSubmit = () => {
        logout()
            .then((response) => {
                setimg('');
                clearInterval(timerId.current);
                setMin(0);
                setSec(0);
                alert("로그아웃");
                navigate('/Main');
            })
    } 

    const dropboxHandler = (data) => {
        if (userID.current == '') return
        if (data === '로그아웃') logoutSubmit();
        else if(data === '연장') refreshTokenSubmit();
        else if(data ==='내 스토리') navigate(`/Profile/${userID.current}`)
    }

    return (
        img != '' ?
        <div className='timer-container'>
            <Navbar.Text> {min}분:{sec}초</Navbar.Text>
            {/* <Button onClick={refreshTokenSubmit} variant="outline-success" style={{ marginLeft: '10px' }}>연장</Button> */}
            {/* <Button onClick={logoutSubmit} variant="outline-danger" style={{ marginLeft: '10px' }}>로그아웃</Button>{' '} */}
            <div onClick={(e)=>{e.stopPropagation();setactive(!active);}} className='header-img-container'>
                <div className='header-img-inner'>
                    <img src={img}></img>
                    <i className="fa fa-caret-down"></i>
                </div>
                <div className={'tab-dropbox-drop' + (active == true ? " active" : "")}>
                    {dropboxcontent_bbs.map((data, idx)=>{
                        return <div onClick={() => {dropboxHandler(data)}} key={idx}>{data}</div>
                    })}
                </div>
            </div>
        </div> : <div></div>
        
    )
}

export default Timer;