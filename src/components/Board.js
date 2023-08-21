import React, {useState, useEffect} from 'react';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Board(){
    const navigate = useNavigate();

    useEffect(() => {
        loginCheckSubmit();
    }, []);

    const loginCheck = () => {
        const url = '/board/loginCheck';
        const data = {};
        return axios.post(url, data,{ withCredentials: true });
    }

    const loginCheckSubmit = () => {
        loginCheck()
            .then((response) => {
                console.log(response.data);
                if(response.data === false){
                    alert("다시 로그인 해주세요");
                    navigate('/Main');
                }
            })
    }

    return (
        <div><Button  type="submit" style={{ width: '450px', marginTop: '30px', height: '45px' }}>아이디찾기</Button></div>
    )
}

export default Board;