import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import React, { Component, useState ,useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

class Header extends Component {

    render() {
        const StyledNavLink = styled(Link)`
            color: gray;
            margin-right: 15px;
            text-decoration: none;
            transition: color 0.3s;

            &:hover {
                color: white;
            }
        `;
        const navLinkHoverStyle = {
            color: 'white', // hover 시 텍스트 색상을 흰색으로 변경
        };
        return (
            <div>
                <Navbar bg="dark" data-bs-theme="dark">
                    <Container>
                        <StyledNavLink to="/board" style={{color:'white'}}>게시판</StyledNavLink>
                        <Nav className="me-auto">

                            <StyledNavLink to="/main">메인</StyledNavLink>
                            <StyledNavLink to="/FindId">아이디찾기</StyledNavLink>
                            <StyledNavLink to="/FindPw">비밀번호찾기</StyledNavLink>

                        </Nav>
                        <Timer count = {this.props.count}/>
                    </Container>
                </Navbar>
            </div>
        )
    }
}

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

    return (
        <Form className="d-flex">
            <Navbar.Text> {min}분:{sec}초</Navbar.Text>
            <Button onClick={refreshTokenSubmit} variant="outline-success" style={{ marginLeft: '10px' }}>연장</Button>
        </Form>
    )
}

export default Header;