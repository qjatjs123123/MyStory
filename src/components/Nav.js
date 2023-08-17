import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link} from 'react-router-dom';
import styled from 'styled-components';

class Header extends Component{
    render(){
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
                </Container>
            </Navbar>
          </div>
        )
    }
}

export default Header;