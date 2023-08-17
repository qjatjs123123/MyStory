import React, {Component} from 'react';
import {Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

class Join extends Component{
    render(){
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '30px'}}>
                <p style={{fontSize:'3rem', fontWeight:'bold', color:'brown'}}>회원가입</p>
                <Form >
                    <Form.Group className="mb-3" controlId="formGroupEmail">
                        <Form.Label>아이디</Form.Label>
                        <Form.Control type="text" placeholder="Enter ID" style={{width:'500px', border: '2px solid black'}}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupPassword">
                        <Form.Label>비밀번호</Form.Label>
                        <Form.Control type="password" placeholder="Password" style={{width:'500px', border: '2px solid black'}}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupPassword">
                        <Form.Label>비밀번호확인</Form.Label>
                        <Form.Control type="password" placeholder="Password" style={{width:'500px', border: '2px solid black'}}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupPassword">
                        <Form.Label>주민등록번호</Form.Label>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <Form.Control type="text" placeholder="First" style={{width:'237px', border: '2px solid black', marginRight:'10px'}}/>
                            <p>-</p>
                            <Form.Control type="password" placeholder="Second" style={{width:'237px', border: '2px solid black', marginLeft:'10px'}}/>
                        </div>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupPassword">
                        <Form.Label>이름</Form.Label>
                        <Form.Control type="text" placeholder="Name" style={{width:'500px', border: '2px solid black'}}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupPassword">
                        <Form.Label>이메일</Form.Label>
                        <Form.Control type="email" placeholder="Email" style={{width:'500px', border: '2px solid black'}}/>
                    </Form.Group>
                    <Button type="submit" style={{width:'500px', marginTop:'30px',height:'45px'}}>가입하기</Button>
                </Form>
            </div>
        )
    }
}

export default Join;