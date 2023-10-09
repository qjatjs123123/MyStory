import React, { useState, useEffect } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';



function ChangePw() {
    const [isCorrect, setIsCorrect] = useState('');
    const [userID, setuserID] = useState('');
    useEffect(() => {
        const urlParams = new URL(window.location.href).searchParams;
        const token = urlParams.get('token');
        const userID = urlParams.get('userID');
        setuserID(userID);
        checkTokenSubmit(token, userID);
    }, []);

    const checkToken = (token, userID) => {
        const url = '/member/checkToken';
        const data = {
            userEmailCode: token,
            userID: userID
        };

        return axios.post(url, data, { withCredentials: true });
    }

    const checkTokenSubmit = (token, userID) => {
        checkToken(token, userID)
            .then((response) => {
                if (response.data === false)
                    setIsCorrect(false);
                else {
                    setIsCorrect(true);
                }
            })
    }

    if (isCorrect === true) {
        return < CorrectForm userID={userID}/>
    } else if (isCorrect === false) {
        return <NotCorrectForm/>
    } else {
        return
    }
}

function NotCorrectForm(){
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <Card style={{ width: '30rem', background: 'ivory' }}>
                <Card.Body>
                    <Card.Title style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '30px' }}>잘못된 접근입니다.</Card.Title><br />
                </Card.Body>
            </Card>
        </div>
    )
}

function CorrectForm (props){
    const [pw, setPw] = useState('');
    const [pwCheck, setPwCheck] = useState(false);
    const [pwCheckCheck, setPwCheckCheck] = useState(false);
    const [pwResult, setPwResult] = useState('');
    const [pwCheckResult, setPwCheckResult] = useState('');

    const navigate = useNavigate();

    const passwordCheck = (e) => {
        setPw(e.target.value);
        if (e.target.value === '') return;
        let reg = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;
        if (!reg.test(e.target.value)) {
            setPwResult('비밀번호 규칙 위반입니다.');
            setPwCheck(false);
        }
        else {
            setPwResult('사용가능한 비밀번호입니다.');
            setPwCheck(true);
        }
    }

    const samePassword = (e) => {
        if (e.target.value === '') return;
        if (e.target.value === pw) {
            setPwCheckResult('비밀번호 일치합니다.');
            setPwCheckCheck(true);
        } else {
            setPwCheckResult('비밀번호 불일치합니다.');
            setPwCheckCheck(false);
        }
    }

    const changePw = () => {
        const url = '/member/changePw';
        const data = {
            userPw: pw,
            userID: props.userID
        };

        return axios.post(url, data, { withCredentials: true });
    }

    const ChnagePwSubmit = (e) => {
        e.preventDefault();
        if (pwCheck && pwCheckCheck) {
            changePw()
                .then((response) => {
                    if (response.data.length === 0)
                        alert("비밀번호변경 실패");
                    else {
                        console.log(response.data);
                        alert("비밀번호변경 성공");
                        navigate("/main");
                    }
                })
        }
        else {
            alert("제대로 입력하세요");
        }
    }
    return (
        <div className='cpw-container'>
            <div className='id-photo'></div>
            <div className="join-content cpw-content">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                        <Card style={{ width: '30rem', background: 'ivory' }}>
                            <Card.Body>
                                <Card.Title style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '30px' }}>비밀번호변경</Card.Title><br />
                                <div>
                                    <Form >
                                        <Form.Group className="mb-3" controlId="formGroupPassword">
                                            <Form.Label>비밀번호</Form.Label>
                                            <Form.Control onBlur={passwordCheck} name='pw' type="password" placeholder="Password" style={{ width: '450px', border: '2px solid black' }} />
                                            <div style={{ height: '10px', fontSize: '13px', color: pwResult === '비밀번호 규칙 위반입니다.' ? 'red' : 'green' }}>{pwResult}</div>
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="formGroupPassword">
                                            <Form.Label>비밀번호확인</Form.Label>
                                            <Form.Control onBlur={samePassword} name='pwcheck' type="password" placeholder="Password" style={{ width: '450px', border: '2px solid black' }} />
                                            <div style={{ height: '10px', fontSize: '13px', color: pwCheckResult === '비밀번호 불일치합니다.' ? 'red' : 'green' }}>{pwCheckResult}</div>

                                        </Form.Group>
                                        <Button onClick={ChnagePwSubmit} type="submit" style={{ width: '450px', marginTop: '30px', height: '45px' }}>비밀번호변경</Button>
                                    </Form>
                                </div>

                            </Card.Body>
                        </Card>
                </div>
            </div>
        </div>
    )
}


export default ChangePw;