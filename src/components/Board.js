import React, {useState, useEffect} from 'react';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';

function Board(){
    const [isLogin, setLogin] = useState(false);
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
                    setLogin(false);
                    alert("다시 로그인 해주세요");
                    navigate('/Main');
                }
                else setLogin(true);
            })
    }

    return (
        isLogin ? (
        <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <td>3</td>
            <td >Larry the Bird</td>
            <td>@twitter</td>
          </tr>
        </tbody>
      </Table>) : (<div></div>)
    )
}

export default Board;