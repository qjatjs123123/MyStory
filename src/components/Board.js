import React, {useState} from 'react';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function Board(){

    const test = () => {
        const url = '/board/test';
        const data = {"Qwe":"qwe"};
        return axios.post(url, data,{ withCredentials: true });
    }

    const testSubmit = () => {
        test()
            .then((response) => {
                console.log(response.data);
            })
    }

    return (
        <div><Button onClick={testSubmit} type="submit" style={{ width: '450px', marginTop: '30px', height: '45px' }}>아이디찾기</Button></div>
    )
}

export default Board;