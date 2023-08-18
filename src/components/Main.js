import React, {Component} from 'react';
import {Card, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link} from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

class Main extends Component{
    constructor(props){
        super(props);
        this.id='';
        this.pw='';
    }

    loginSubmit = (e) =>{
        e.preventDefault();
        this.login()
            .then((response) => {
                if (response.data.length === 0)
                    alert("로그인 실패");
                else
                    alert("로그인 성공");
            })

    }
    login = () => {
        const url = '/member/login';
        const data = {
            userId: this.ID,
            userPw: this.PW,
        };

        return axios.post(url, data);
    }

    handleValueChange = (e) => {
        if (e.target.name === 'ID') this.ID = e.target.value;
        else if(e.target.name ==='PW') this.PW = e.target.value;
    }

    render(){
        const StyledNavLink = styled(Link)`
        color: gray;
        margin-right: 15px;
        text-decoration: none;
        transition: color 0.3s;

        &:hover {
            color: black;
        }
    `;
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <Card style={{ width: '25rem', background:'lightgray'}}>
                    <Card.Body>
                        <Card.Title style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '30px'}}>게시판</Card.Title>
                        <div>
                            <Form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <input type="text" placeholder="ID" name='ID' onChange={this.handleValueChange} style={{ marginBottom: '10px', width: '23rem',marginTop:'20px'}} />
                                <input type="password" placeholder="PW" name ='PW' onChange={this.handleValueChange} style={{width: '23rem'}}/> <br/>
                                <button type="submit" className="btn btn-primary" style={{ width: '6rem', marginBottom:'15px'}} onClick={this.loginSubmit}>로그인</button>
                            </Form>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <StyledNavLink to="/join">회원가입</StyledNavLink>
                            <StyledNavLink to="/FindId">아이디찾기</StyledNavLink>
                            <StyledNavLink to="/FindPw">비밀번호찾기</StyledNavLink>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}

export default Main;