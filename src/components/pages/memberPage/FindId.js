import React, {useState} from 'react';
import { Card,  Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function FindId(){
    const [name, setName] = useState('');
    const [first, setFirst] = useState('');
    const [second, setSecond] = useState('');
    const [result, setResult] = useState('');

    const valueChange = (e) => {
        if (e.target.name === 'name') setName(e.target.value);
        else if(e.target.name === 'first') setFirst(e.target.value);
        else if(e.target.name === 'second') setSecond(e.target.value);
    }

    const findId = () => {
        const url = '/member/findId';
        const data = {
            userName: name,
            userNum: first + second
        };

        return axios.post(url, data, { withCredentials: true });
    }

    const findIdSubmit = (e) => {
        e.preventDefault();
        if (name !== '' && first !== '' && second !== '') {
            findId()
                .then((response) => {
                    if (response.data.length === 0)
                        setResult('해당하는 ID가 없습니다.');
                    else {
                        setResult(response.data.userID);
                    }
                })
        }
        else {
            alert("제대로 입력하세요");
        }
    }

    return (
        <div className='id-container'>
            <div className='id-photo'>

            </div>
            <div className="join-content id-content">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Card style={{backgroundColor:'transparent', border:'none'}}>
                        <Card.Body>
                            <Card.Title style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '30px'}}>아이디 찾기</Card.Title><br/>
                            <div>
                            <Form >
                                <Form.Group className="mb-3" controlId="formGroupEmail">
                                    <Form.Label>이름</Form.Label>
                                    <Form.Control onChange = {valueChange} name='name' type="text" placeholder="Enter name" style={{border: '2px solid black' }} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formGroupPassword">
                                    <Form.Label>주민등록번호</Form.Label>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <Form.Control onChange = {valueChange} name='first' type="text" placeholder="First" style={{ width: '237px', border: '2px solid black', marginRight: '10px' }} />
                                        <div>-</div>
                                        <Form.Control onChange = {valueChange} name='second' type="password" placeholder="Second" style={{ width: '237px', border: '2px solid black', marginLeft: '10px' }} />
                                    </div>
                                </Form.Group>
                                <div style={{ height: '30px', fontSize: '16px', color:'red', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{result}</div>
                                <Button onClick={findIdSubmit} type="submit" style={{ width:'500px', marginTop: '30px', height: '45px' }}>아이디찾기</Button>
                            </Form>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default FindId;