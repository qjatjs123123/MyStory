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
                        <Navbar.Brand href="#home">게시판</Navbar.Brand>
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
    
    const [min, setMin] = useState(0);
    const [sec, setSec] = useState(0);
    const time = useRef(1800);
    const timerId = useRef(null);
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
        console.log("qweqwewqeqwe");
        getTimerSubmit();
        return () => clearInterval(timerId.current)
    }, [props.count])

    useEffect(() => {
        if(time.current <= 0){
            clearInterval(timerId.current);
        }
    }, [sec]);

    return (
        <Form className="d-flex">
            <Navbar.Text> {min}분:{sec}초</Navbar.Text>
            <Button variant="outline-success" style={{ marginLeft: '10px' }}>연장</Button>
        </Form>
    )
}

export default Header;