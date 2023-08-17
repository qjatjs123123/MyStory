import React, {Component} from 'react';
import {Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

class Join extends Component{
    constructor(props){
        super(props);
        this.id='';
        this.idCheck = false;
        this.pw='';
        this.pwCheck = false;
        this.pwcheck='';
        this.pwCheckCheck = false;
        this.first='';
        this.firstcheck = false;
        this.second='';
        this.secondcheck = false;
        this.name='';
        this.namedcheck = false;
        this.email='';
        this.emailcheck = false;
        this.state = {
            idresult: '',
            pwresult : '',
            pwcheckresult: '',
            firstresult: '',
            nameresult: '',
            emailresult: ''
          };
    }

    duplicateIdCheck = (e) =>{
        this.id=e.target.value;
        if (e.target.value === '') return ;
        this.IdCheck()
            .then((response) => {
                if (response.data.length === 0){
                    this.setState({ idresult: '사용가능한 아이디 입니다.' }); 
                    this.idCheck = true;   
                }              
                else{
                    this.setState({ idresult: '중복된 아이디 입니다.' });
                    this.idCheck = false;  
                }
            })


    }
    IdCheck = () => {
        const url = '/member/idcheck';
        const data = {
            userId: this.id,
        };

        return axios.post(url, data);
    }

    passwordCheck = (e) => {
        if (e.target.value === '') return ;
        let reg = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;
        this.pw=e.target.value;
        if( !reg.test(e.target.value) ) {
            this.setState({ pwresult: '비밀번호 규칙 위반입니다.' });   
            this.pwCheck = false;
        } 
        else{
            this.setState({ pwresult: '사용가능한 비밀번호입니다.' });  
            this.pwCheck = true;
        }
    }

    samePassword = (e) => {
        if (e.target.value === '') return ;
        if(e.target.value === this.pw){
            this.setState({ pwcheckresult: '비밀번호 일치합니다.' });   
            this.pwCheckCheck = true;
        }else{
            this.setState({ pwcheckresult: '비밀번호 불일치합니다.' });   
            this.pwCheckCheck = false;
        }
    }   

    numCheck = (e) => {
        if (e.target.value === '') return ;
        if (e.target.name === 'first'){
            let reg = /^\d{6}/;
            if( !reg.test(e.target.value) ) {
                this.setState({ firstresult: '주민번호 오류입니다.' });   
                this.firstcheck = false;
            }else{
                this.firstcheck = true;
            }
        }else{
            let reg = /^\d{7}/;
            if( !reg.test(e.target.value) ) {
                this.setState({ firstresult: '주민번호 오류입니다.' });   
                this.secondcheck = false;
            }else{
                this.secondcheck = true;
            }
        }
        if(this.firstcheck && this.secondcheck) this.setState({ firstresult: '올바른 주민번호 입니다.' });   
    }

    nameCheck = (e) => {
        if (e.target.value === '') return ;
        let reg = /\s/;
        if( !reg.test(e.target.value) ) {
            this.setState({ nameresult: '좋은 이름입니다.' });   
            this.namedcheck = true;
        } 
        else{
            this.setState({ nameresult: '공백이 있습니다.' });  
            this.namedcheck = false;
        }
    }

    emailCheck = (e) => {
        if (e.target.value === '') return ;
        let reg = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if( !reg.test(e.target.value) ) {
            this.setState({ emailresult: '이메일 형식 오류입니다.' });   
            this.emailcheck = false;
        } 
        else{
            this.setState({ emailresult: '올바른 이메일 형식입니다.' });  
            this.emailcheck = true;
        }
    }

    joinSubmit = (e) => {
        e.preventDefault();
        console.log(this.idCheck, this.pwCheck,this.pwCheckCheck,
            this.firstcheck, this.secondcheck,this.namedcheck,this.emailcheck)
        if(this.idCheck && this.pwCheck && this.pwCheckCheck && 
            this.firstcheck && this.secondcheck && this.namedcheck && this.emailcheck){
                alert("성공");
            }
        else{
            alert("실패");
        }
    }
    render(){
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '30px'}}>
                <p style={{fontSize:'3rem', fontWeight:'bold', color:'brown'}}>회원가입</p>
                <Form >
                    <Form.Group className="mb-3" controlId="formGroupEmail">
                        <Form.Label>아이디</Form.Label>
                        <Form.Control onBlur={this.duplicateIdCheck} name='id' type="text" placeholder="Enter ID" style={{width:'500px', border: '2px solid black'}}/>
                        <div style={{height:'10px', fontSize:'13px', color: this.state.idresult === '중복된 아이디 입니다.' ? 'red' : 'green' }}>{this.state.idresult}</div>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupPassword">
                        <Form.Label>비밀번호</Form.Label>
                        <Form.Control onBlur={this.passwordCheck} name='pw' type="password" placeholder="Password" style={{width:'500px', border: '2px solid black'}}/>
                        <div style={{height:'10px', fontSize:'13px', color: this.state.pwresult === '비밀번호 규칙 위반입니다.' ? 'red' : 'green' }}>{this.state.pwresult}</div>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupPassword">
                        <Form.Label>비밀번호확인</Form.Label>
                        <Form.Control onBlur = {this.samePassword} name='pwcheck' type="password" placeholder="Password" style={{width:'500px', border: '2px solid black'}}/>
                        <div style={{height:'10px', fontSize:'13px', color: this.state.pwcheckresult === '비밀번호 불일치합니다.' ? 'red' : 'green' }}>{this.state.pwcheckresult}</div>
                        
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupPassword">
                        <Form.Label>주민등록번호</Form.Label>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <Form.Control onBlur = {this.numCheck} name='first' type="text" placeholder="First" style={{width:'237px', border: '2px solid black', marginRight:'10px'}}/>
                            <p>-</p>
                            <Form.Control onBlur = {this.numCheck} name='second' type="password" placeholder="Second" style={{width:'237px', border: '2px solid black', marginLeft:'10px'}}/>
                        </div>
                        <div style={{height:'10px', fontSize:'13px', color: this.state.firstresult === '주민번호 오류입니다.' ? 'red' : 'green' }}>{this.state.firstresult}</div>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupPassword">
                        <Form.Label>이름</Form.Label>
                        <Form.Control onBlur = {this.nameCheck} name='name' type="text" placeholder="Name" style={{width:'500px', border: '2px solid black'}}/>
                        <div style={{height:'10px', fontSize:'13px', color: this.state.nameresult === '공백이 있습니다.' ? 'red' : 'green' }}>{this.state.nameresult}</div>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupPassword">
                        <Form.Label>이메일</Form.Label>
                        <Form.Control onBlur={this.emailCheck} name='email' type="email" placeholder="Email" style={{width:'500px', border: '2px solid black'}}/>
                        <div style={{height:'10px', fontSize:'13px', color: this.state.emailresult === '이메일 형식 오류입니다.' ? 'red' : 'green' }}>{this.state.emailresult}</div>
                    </Form.Group>
                    <Button onClick={this.joinSubmit} type="submit" style={{width:'500px', marginTop:'30px',height:'45px'}}>가입하기</Button>
                </Form>
            </div>
        )
    }
}

export default Join;