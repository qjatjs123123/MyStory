
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

    const getTimer = () => {
        
        const url = '/board/getTimer';
        const data = {};
        return axios.post(url, data,{ withCredentials: true });
    }

    const getTimerSubmit = () => {
        getTimer()
            .then((response) => {
                if (response.data === 'logout') return;
                time.current = 1800 - response.data.TIMER;
                timerId.current = setInterval(() => {
                    setMin(parseInt(time.current/60));
                    setSec(time.current%60);
                    time.current -= 1;
                }, 1000);
            })
        
    }
    
    useEffect(() => {      
        getTimerSubmit();
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
                clearInterval(timerId.current);
                setMin(0);
                setSec(0);
                alert("로그아웃");
                navigate('/Main');
            })
    } 

    return (
        <Form className="d-flex">
            <Navbar.Text> {min}분:{sec}초</Navbar.Text>
            <Button onClick={refreshTokenSubmit} variant="outline-success" style={{ marginLeft: '10px' }}>연장</Button>
            <Button onClick={logoutSubmit} variant="outline-danger" style={{ marginLeft: '10px' }}>로그아웃</Button>{' '}
        </Form>
    )
}

export default Timer;