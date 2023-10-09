import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


function BBSRecommend(props) {
    const [reommendflg, setreommendflg] = useState(false);
    const [good, setgood] = useState(0);
    const [bad, setbad] = useState(0);
    
    useEffect (() =>{
        selectrecommendSubmit();
    },[reommendflg])

    const selectrecommend = () =>{
        const url = '/board/selectrecommend';
        const data = {bbsID: parseInt(props.bbsID)};
        return axios.post(url, data, { withCredentials: true });
    }

    const selectrecommendSubmit = () =>{
        selectrecommend()
            .then((response) => {   
                setgood(response.data[0].bbsGood);  
                setbad(response.data[0].bbsBad);  
            })
    }

    const insertRecommend = (flg) => {
        const url = '/board/insertRecommend';
        const data = {
            bbsID:props.bbsID,
            userID:props.curuserID,
            flg:flg
        };
        return axios.post(url, data, { withCredentials: true });
    }

    const insertRecommendSubmit = (e) => {
        insertRecommend(e.target.name)
            .then((response) => {
                if (response.data === 'already') alert("더이상 추천할 수 없습니다.");
                else if(response.data === true) setreommendflg(!reommendflg);
            })
    }
    return (
        <div style={{ marginTop: '20px' }}>
            <Card style={{ width: '18rem', background: 'transparent', border: '1px solid black' }}>
                <Card.Body style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ color: "red" }}>{good}</div>
                    <Button name='good' onClick = {insertRecommendSubmit} style={{ borderRadius: '50%', padding: '15px 15px', lineHeight: '1', marginRight: '5px', marginLeft: '15px' }} variant="primary">♥<br />추천</Button>
                    <Button name='bad'  onClick = {insertRecommendSubmit} style={{ borderRadius: '50%', padding: '15px 15px', lineHeight: '1', marginLeft: '5px', marginRight: '15px' }} variant="secondary">♡<br />비추</Button>
                    <div >{bad}</div>
                </Card.Body>
            </Card>
        </div>
    )
}

export default BBSRecommend;