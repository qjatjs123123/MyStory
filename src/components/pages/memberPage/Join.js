import React, { useState, useEffect, useRef } from 'react';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Join() {
    const [id, setId] = useState('');
    const [idCheck, setIdCheck] = useState(false);
    const [pw, setPw] = useState('');
    const [pwCheck, setPwCheck] = useState(false);
    const [pwCheckCheck, setPwCheckCheck] = useState(false);
    const [first, setFirst] = useState('');
    const [firstcheck, setFirstCheck] = useState(false);
    const [second, setSecond] = useState('');
    const [secondcheck, setSecondCheck] = useState(false);
    const [name, setName] = useState('');
    const [namedcheck, setNamedCheck] = useState(false);
    const [email, setEmail] = useState('');
    const [emailcheck, setEmailCheck] = useState(false);

    const [idResult, setIdResult] = useState('');
    const [pwResult, setPwResult] = useState('');
    const [pwCheckResult, setPwCheckResult] = useState('');
    const [firstResult, setFirstResult] = useState('');
    const [nameResult, setNameResult] = useState('');
    const [emailResult, setEmailResult] = useState('');
    const navigate = useNavigate();
    const tabsref = useRef();
    const arr = ['0%', '-100%', '-200%']
    let idx = 0;
    useEffect(() => {
        const timer = setInterval(() => {
            tabsref.current.style.marginLeft = arr[idx%3];
            idx = (idx + 1) % 3;
        }, 5000);
        return () => {clearInterval(timer)}
    }, [])
    useEffect(() => {
        if (firstcheck && secondcheck) {
            setFirstResult('올바른 주민번호 입니다.');
        }
    }, [firstcheck, secondcheck]);
    const duplicateIdCheck = (e) => {
        
        setId(e.target.value);
        console.log(e.target.value);
        if (e.target.value === '') return;
        IdCheck(e.target.value)
            .then((response) => {
                if (response.data.length === 0) {
                    setIdResult('사용가능한 아이디 입니다.');
                    setIdCheck(true);
                }
                else {
                    setIdResult('중복된 아이디 입니다.');
                    setIdCheck(false);
                }
            })
    }
    
    const IdCheck = (id) => {
        const url = '/member/idcheck';
        const data = {
            userId: id,
        };

        return axios.post(url, data);
    }

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

    const numCheck = (e) => {
        if (e.target.value === '') return;
        if (e.target.name === 'first') {
            let reg = /^\d{6}/;
            if (!reg.test(e.target.value)) {
                setFirstResult('주민번호 오류입니다.');
                setFirstCheck(false);
            } else {
                setFirstCheck(true);
                console.log(firstcheck , secondcheck)
            }
            setFirst(e.target.value);
        } else {
            let reg = /^\d{7}/;
            if (!reg.test(e.target.value)) {
                setFirstResult('주민번호 오류입니다.');
                setSecondCheck(false);
            } else {
                setSecondCheck(true);
            }
            setSecond(e.target.value);
        }
        
        if (firstcheck && secondcheck) setFirstResult('올바른 주민번호 입니다.');
    }

    const nameCheck = (e) => {
        if (e.target.value === '') return;
        setName(e.target.value);
        let reg = /\s/;
        if (!reg.test(e.target.value)) {
            setNameResult('좋은 이름입니다.');
            setNamedCheck(true);
        }
        else {
            setNameResult('공백이 있습니다.');
            setNamedCheck(false);
        }
    }

    const emailCheck = (e) => {
        if (e.target.value === '') return;
        setEmail(e.target.value);
        let reg = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if (!reg.test(e.target.value)) {
            setEmailResult('이메일 형식 오류입니다.');
            setEmailCheck(false);
        }
        else {
            setEmailResult('올바른 이메일 형식입니다.');
            setEmailCheck(true);
        }
    }

    const join = () => {
        const url = '/member/join';
        const data = {
            userId: id,
            userPw: pw,
            userName: name,
            userMail: email,
            userNum: first + second
        };

        return axios.post(url, data);
    }

    const joinSubmit = (e) => {
        e.preventDefault();
        if (idCheck && pwCheck && pwCheckCheck &&
            firstcheck && secondcheck && namedcheck && email != '') {
            join()
                .then((response) => {
                    if (response.data.length === 0)
                        alert("회원가입 실패");
                    else {
                        alert("회원가입 성공");
                        navigate('/main');
                    }
                })
        }
        else {
            alert("제대로 입력하세요");
        }
    }

    return (
        <div className='join-container'>
            <div className='join-content'>
                <div className='join-image'>
                    <div className='tabs' ref = {tabsref}>
                        <div className='tab'>
                            <div class="join-image1"></div>
                        </div>
                        <div className='tab'>
                            <div class="join-image2"></div>
                        </div>
                        <div className='tab'>
                            <div class="join-image3"></div>
                        </div>
                    </div>
                </div>
                <div className='join-right'>
                    <div style={{fontSize:'40px', fontWeight: 'bold', marginBottom:'10px'}}>회원가입</div>
                    
                    <Form >
                        <Form.Group className="mb-3" controlId="formGroupEmail">
                            <Form.Label>아이디</Form.Label>
                            <Form.Control onBlur={duplicateIdCheck} name='id' type="text" placeholder="Enter ID" style={{ width: '500px', border: '2px solid black' }} />
                            <div style={{ height: '10px', fontSize: '13px', color: idResult === '중복된 아이디 입니다.' ? 'red' : 'green' }}>{idResult}</div>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupPassword">
                            <Form.Label>비밀번호</Form.Label>
                            <Form.Control onBlur={passwordCheck} name='pw' type="password" placeholder="Password" style={{ width: '500px', border: '2px solid black' }} />
                            <div style={{ height: '10px', fontSize: '13px', color: pwResult === '비밀번호 규칙 위반입니다.' ? 'red' : 'green' }}>{pwResult}</div>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupPassword">
                            <Form.Label>비밀번호확인</Form.Label>
                            <Form.Control onBlur={samePassword} name='pwcheck' type="password" placeholder="Password" style={{ width: '500px', border: '2px solid black' }} />
                            <div style={{ height: '10px', fontSize: '13px', color: pwCheckResult === '비밀번호 불일치합니다.' ? 'red' : 'green' }}>{pwCheckResult}</div>

                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupPassword">
                            <Form.Label>주민등록번호</Form.Label>
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <Form.Control onBlur={numCheck} name='first' type="text" placeholder="First" style={{ width: '237px', border: '2px solid black', marginRight: '10px' }} />
                                <div>-</div>
                                <Form.Control onBlur={numCheck} name='second' type="password" placeholder="Second" style={{ width: '237px', border: '2px solid black', marginLeft: '10px' }} />
                            </div>
                            <div style={{ height: '10px', fontSize: '13px', color: firstResult === '주민번호 오류입니다.' ? 'red' : 'green' }}>{firstResult}</div>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupPassword">
                            <Form.Label>이름</Form.Label>
                            <Form.Control onBlur={nameCheck} name='name' type="text" placeholder="Name" style={{ width: '500px', border: '2px solid black' }} />
                            <div style={{ height: '10px', fontSize: '13px', color: nameResult === '공백이 있습니다.' ? 'red' : 'green' }}>{nameResult}</div>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupPassword">
                            <Form.Label>이메일</Form.Label>
                            <Form.Control onBlur={emailCheck} name='email' type="email" placeholder="Email" style={{ width: '500px', border: '2px solid black' }} />
                            <div style={{ height: '10px', fontSize: '13px', color: emailResult === '이메일 형식 오류입니다.' ? 'red' : 'green' }}>{emailResult}</div>
                        </Form.Group>
                        <Button onClick={joinSubmit} type="submit" style={{ width: '500px', marginTop: '20px', height: '45px' }}>다음</Button>
                    </Form>
                </div>
            </div>
        </div>
    )

}

export default Join;