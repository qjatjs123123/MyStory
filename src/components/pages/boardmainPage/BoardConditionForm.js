import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import React, { useState } from 'react';
let count = 10
function BoardConditionForm(props) {
    console.log("condition");
    // Condition Form
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [title, setTitle] = useState('');
    const [userID, setuserID] = useState('');

    const valueHandle = (e) =>{
        if(e.target.name === 'title') setTitle(e.target.value);
        else if(e.target.name === 'id') setuserID(e.target.value);
    }


    const SelectConditionFormSubmit = (e) =>{
        e.preventDefault();
        props.setStartDate(startDate);
        props.setEndDate(endDate);
        props.setTitle(title);
        props.setuserID(userID);
        props.setPage(1);
    } 
    return (
        <div style={{ width: '100%', textAlign: 'left'}}>
            <Form>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start',marginLeft:'40px'}}>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label style={{ color: 'black' }}>제목</Form.Label>
                        <Form.Control onChange={valueHandle} name = 'title' type="text" placeholder="제목" style={{ borderColor: 'black', minWidth:'100px'}} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1" style={{marginLeft:'50px'}}>
                        <Form.Label style={{ color: 'black' }}>작성자</Form.Label>
                        <Form.Control onChange={valueHandle} name = 'id' type="text" placeholder="작성자" style={{ borderColor: 'black' ,minWidth:'100px'}} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1" style={{marginLeft:'50px'}}>
                        <Form.Label style={{ color: 'black' }}>시작일자</Form.Label><br/>
                        <DatePicker style={{ borderColor: 'black' }} locale="ko" selected={startDate}  onChange={(date) => setStartDate(date)} dateFormat="yyyy-MM-dd" className="custom-datepicker"/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1" style={{marginLeft:'50px'}}>
                        <br/>
                        <Form.Label style={{ color: 'black' }}>~</Form.Label><br/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1" style={{marginLeft:'50px'}}>
                        <Form.Label style={{ color: 'black' }}>종료일자</Form.Label><br/>
                        <DatePicker style={{ borderColor: 'black' }} locale="ko" selected={endDate}  onChange={(date) => setEndDate(date)} dateFormat="yyyy-MM-dd" className="custom-datepicker"/>
                    </Form.Group>
                    <Button onClick={SelectConditionFormSubmit} type="submit" style={{marginLeft:'50px', width: '200px', marginTop: '30px', height: '40px' }}>찾기</Button>
                </div>
            </Form>
            
        </div>
    );
}

export default React.memo(BoardConditionForm);