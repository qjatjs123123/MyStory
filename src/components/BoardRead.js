import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function BoardRead(props) {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [bbsID, setBbsID] = useState(queryParams.get('bbsID'));
    const [bbsTitle, setbbsTitle] = useState('');
    const [bbsContent, setbbsContent] = useState('');
    const [userID, setuserID] = useState('');
    const [bbsDate, setbbsDate] = useState('');
    const [isLogin, setLogin] = useState(false);
    const [curuserID, setCuruserID] = useState('');
   
    const navigate = useNavigate();

    useEffect(() => {  
        loginCheckSubmit();
        selectBbsIDInfoSubmit();
    }, []);



    const loginCheck = () => {
        const url = '/board/loginCheck';
        const data = {};
        return axios.post(url, data, { withCredentials: true });
    }
    const loginCheckSubmit = () => {
        loginCheck()
            .then((response) => {
                if (response.data === false) {
                    setLogin(false);
                    alert("다시 로그인 해주세요");
                    navigate('/Main');
                }
                else {
                    setLogin(true);
                    setCuruserID(response.data);
                }
            })
    }
    const selectBbsIDInfo = () => {
        const url = '/board/selectBbsIDInfo';
        const data = { 
            bbsID:bbsID
        }
        return axios.post(url, data, { withCredentials: true });
    }
    const MoveToBbsUpdate = () => {
        props.setbbsID(bbsID);
        props.setbbsTitle(bbsTitle);
        props.setbbsContent(bbsContent);
        navigate('/BoardWrite/Update');
    }

    function dateFormat(date) {
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();

        month = month >= 10 ? month : '0' + month;
        day = day >= 10 ? day : '0' + day;
        hour = hour >= 10 ? hour : '0' + hour;
        minute = minute >= 10 ? minute : '0' + minute;
        second = second >= 10 ? second : '0' + second;

        return date.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
}
    const selectBbsIDInfoSubmit = () => {
        selectBbsIDInfo()
            .then((response) => {
                console.log(response.data);
                if (response.data === false) {
                    alert("에러 발생");
                    navigate('/Main');
                }else if(response.data.length === 0){
                    alert("삭제된 게시물 입니다.");
                    navigate('/board');
                }else{
                    
                    setbbsTitle(response.data[0].bbsTitle);
                    setbbsContent(response.data[0].bbsContent);
                    setuserID(response.data[0].userID);
                    setbbsDate(dateFormat(new Date(response.data[0].bbsDate)));
                }
            })
    }

    return (
        isLogin ? (
            <div>
                <BoardContent MoveToBbsUpdate={MoveToBbsUpdate} curuserID={curuserID} content={bbsContent} bbsTitle = {bbsTitle} userID={userID} bbsDate={bbsDate}/>
            </div>
        ):<div></div>

        
    )
}

function BoardContent(props) {
    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 style={{ marginTop: '50px', fontWeight: 'bolder',marginBottom:'20px'}}>내용</h3> 
            <div style={{borderTop : '5px solid black'}}>
                <div style={{marginTop:'20px', borderBottom : '1px solid black'}}>
                    <h5 style={{fontWeight: 'bold'}}>{props.bbsTitle} {props.curuserID === props.userID ? <Button onClick={props.MoveToBbsUpdate} size="sm" style={{marginLeft:'10px'}} variant="dark">글수정</Button> : null}</h5>
                    <div style={{marginBottom:'20px'}}>{props.userID} | {props.bbsDate}</div>
                </div>
                <div style={{marginTop:'20px'}}dangerouslySetInnerHTML={{ __html: props.content }} />
            </div>
        </div>
    );
}

export default BoardRead;