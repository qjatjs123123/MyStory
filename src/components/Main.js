import React, {useState} from 'react';
import {Card, Form,Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link} from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Main(){
    const [ID, setID] = useState('');
    const [PW, setPW] = useState('');
    const navigate = useNavigate();
    const StyledNavLink = styled(Link)`
        color: gray;
        margin-right: 15px;
        text-decoration: none;
        transition: color 0.3s;

        &:hover {
            color: black;
        }
    `

    const loginSubmit = (e) =>{
        e.preventDefault();
        login()
            .then((response) => {
                console.log(response.data);
                if (response.data.length === 0)
                    alert("로그인 실패");
                else
                    navigate('/Board');
            })

    }

    const login = () => {
        const url = '/member/login';
        const data = {
            userId: ID,
            userPw: PW,
        };

        return axios.post(url, data);
    }

    const handleValueChange = (e) => {

        if (e.target.name === 'ID') setID(e.target.value);
        else if(e.target.name ==='PW') setPW(                                   e.target.value);
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <Card style={{ width: '25rem', background:'lightgray'}}>
                    <Card.Body>
                        <Card.Title style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '30px'}}>게시판</Card.Title>
                        <div>
                            <Form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Form.Group className="mb-3" controlId="formGroupEmail">
                                    <Form.Label>아이디</Form.Label>
                                    <Form.Control type="text" placeholder="ID" name='ID' onChange={handleValueChange} style={{width: '23rem'}}/>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formGroupPassword">
                                    <Form.Label>비밀번호</Form.Label>
                                    <Form.Control type="password" placeholder="PW" name ='PW' onChange={handleValueChange} style={{width: '23rem'}}/> <br/>        
                                </Form.Group>
                                <Button type="submit" className="btn btn-primary" style={{ width: '6rem', marginBottom:'15px'}} onClick={loginSubmit}>로그인</Button>
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


export default Main;