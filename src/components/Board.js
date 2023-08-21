import React, {useState, useEffect} from 'react';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';

function Board(){
    const [bbslist, setBbslist] = useState([]);
    const [isLogin, setLogin] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        loginCheckSubmit();
        selectBbsListSubmit();
    }, []);

    

    const selectBbsList = () => {
        const url = '/board/bbsList';
        const data={};
        return axios.post(url, data,{ withCredentials: true });
    }

    const selectBbsListSubmit = () => {
        selectBbsList()
            .then((response) => {
                if(response.data === false){
                    alert("에러 발생");
                    navigate('/Main');
                }
                else setBbslist(response.data);
                console.log(response.data,bbslist);
            })
    }

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
                    setLogin(false);
                    alert("다시 로그인 해주세요");
                    navigate('/Main');
                }
                else setLogin(true);
            })
    }
    return (
        isLogin ? (
        <div>
        <div style={{width:'80%', textAlign:'center',marginLeft:'10%'}}>
            <h3 style={{marginTop:'50px', marginBottom:'25px', fontWeight:'bolder'}}>게시판</h3>
        <Table striped bordered hover variant="dark" style={{borderColor:'white'}}>
        <thead>
          <tr style={{}}>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
          </tr>
        </thead>
            
        <tbody>
        {bbslist.map((c) => {
            return <BbsData key = {c.bbsID} num = {c.bbsID} title={c.bbsTitle} name={c.userID} date={c.bbsDate} />
            })}
        </tbody>
      </Table> 
      </div></div>) : (<div></div>)
    )
}

function BbsData(props){
    const dateFormat=(param)=>{
        const date = new Date(param);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }
    return(
        <tr >
            <td >{props.num}</td>
            <td>{props.title}</td>
            <td>{props.name}</td>
            <td>{dateFormat(props.date)}</td>
        </tr>
    )
}

export default Board;