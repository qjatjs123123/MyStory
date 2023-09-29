import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Timer from './timer';


class Header extends Component {

    render() {
        const StyledNavLink = styled(Link)`
            display:inline-block;
            color: black;
            margin-right: 15px;
            text-decoration: none;
            transform: translateY(20%);
            &:hover {
                font-weight:600;
            }
        `;
        const navLinkHoverStyle = {
            color: 'white', // hover 시 텍스트 색상을 흰색으로 변경
        };
        return (
            <div className='header'>
                <div className='header-left'>
                    <Link to="/main">
                    <img className="logo-title" src={process.env.PUBLIC_URL+'images/logo-title.png'}></img>
                    </Link>
                    <StyledNavLink to="/FindId">아이디찾기</StyledNavLink>
                    <StyledNavLink to="/FindPw">비밀번호찾기</StyledNavLink>
                    <StyledNavLink to="/board">게시판</StyledNavLink>
                    <StyledNavLink to="/BoardWrite">글쓰기</StyledNavLink>
                    <Timer count = {this.props.count}/>
                </div>
                {/* <Navbar >
                    <Container>
                        <StyledNavLink to="/main" style={{color:'white'}}>메인</StyledNavLink>
                        <Nav >
                        <img className="logo-title" src={process.env.PUBLIC_URL+'images/logo-title.png'}></img>
                            <StyledNavLink to="/FindId">아이디찾기</StyledNavLink>
                            <StyledNavLink to="/FindPw">비밀번호찾기</StyledNavLink>
                            <StyledNavLink to="/board">게시판</StyledNavLink>
                            <StyledNavLink to="/BoardWrite">글쓰기</StyledNavLink>
                        </Nav>
                        <Timer count = {this.props.count}/>
                    </Container>
                </Navbar> */}
            </div>
        )
    }
}

export default Header;