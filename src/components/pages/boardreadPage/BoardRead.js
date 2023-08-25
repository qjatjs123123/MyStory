import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import BBSContent from './BBSContent';
import BBSRecommend from './BBSRecommend';
import BBSReply from './BBSReply';

function BoardRead(props) {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [bbsID, setBbsID] = useState(queryParams.get('bbsID'));
    const [isLogin, setLogin] = useState(false);
    const [curuserID, setCuruserID] = useState('');
    const navigate = useNavigate();

    useEffect(() => {   
        loginCheckSubmit();    
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
    const loginCheckSubmitProps = () => {
        loginCheck()
        .then((response) => {
            if (response.data === false) {
                alert("다시 로그인 해주세요");
                navigate('/Main');
            }
        })
    }

    return (
        isLogin ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <BBSContent curuserID={curuserID} bbsID={bbsID}/>  
                <BBSRecommend curuserID={curuserID} bbsID={bbsID}/>
                <BBSReply curuserID={curuserID} bbsID={bbsID} loginCheckSubmitProps={loginCheckSubmitProps}/>
            </div>
        ) : <div></div>


    )
}

export default BoardRead;