import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { registerLocale, setDefaultLocale } from  "react-datepicker";
import './datepicker.css';
import ko from 'date-fns/locale/ko';

import BoardConditionForm from './BoardConditionForm';
import BoardLimit from './BoardLimit';
import BoardTable from './BoardTable';
import BoardPage from './BoardPage';

registerLocale('ko', ko);

function BoardMain() {
    //page,limit
    console.log("main");
    const [curpage, setPage] = useState(1);
    const [maxpage, setMaxPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [bbslist, setBbslist] = useState([]);
    const [isLogin, setLogin] = useState(false);
    const navigate = useNavigate();

    // Condition Form
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [title, setTitle] = useState('');
    const [userID, setuserID] = useState('');

    // Order Flg
    const [orderTarget, setorderTarget] = useState('bbsID');
    const [orderValue, setorderValue] = useState('DESC');
    const [IsRender, setIsRender] = useState(false);

    useEffect(() => {   
        loginCheckSubmit();    
    }, []);

    useEffect(() => {
        selectBbsListCountSubmit();
        selectBbsListSubmit();
    }, [startDate, endDate, title, userID,limit,orderTarget,orderValue,curpage])

    const selectBbsList = () => {
        const url = '/board/bbsConditionList';
        const data = {
            title: title,
            userID: userID,
            startDate: startDate !== null ? `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()} 00:00:00` : null,
            endDate: endDate !== null ? `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()} 23:59:59` : null,
            limit: limit,
            page: curpage,
            orderTarget: orderTarget,
            orderValue: orderValue
        };
        return axios.post(url, data, { withCredentials: true });
    }

    const selectBbsListSubmit = () => {
        selectBbsList()
            .then((response) => {
                if (response.data === false) {
                    alert("에러 발생");
                    navigate('/Main');
                }
                else setBbslist(response.data);
            })
    }

    const selectBbsListCount = () => {
        const url = '/board/bbsListCount';
        const data = { title: title,
                        userID: userID,
                        startDate: startDate !== null ?`${startDate.getFullYear()}-${startDate.getMonth()+1}-${startDate.getDate()} 00:00:00` : null,
                        endDate: endDate !== null ?`${endDate.getFullYear()}-${endDate.getMonth()+1}-${endDate.getDate()} 23:59:59` : null}
        return axios.post(url, data, { withCredentials: true });
    }

    const selectBbsListCountSubmit = () => {
        selectBbsListCount()
            .then((response) => {
                if (response.data === false) {
                    alert("에러 발생");
                    navigate('/Main');
                }
                let maxvalue = 1
                if (Math.ceil(response.data[0].COUNT / limit) === 0) setMaxPage(maxvalue);
                else {setMaxPage(Math.ceil(response.data[0].COUNT / limit)); maxvalue=Math.ceil(response.data[0].COUNT / limit)}
                
                if (curpage > maxvalue) setPage(maxvalue);
            })
    }
    
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
            <div>
                <div style={{ width: '80%', textAlign: 'center', marginLeft: '10%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h3 style={{ marginTop: '50px', fontWeight: 'bolder' }}>게시판</h3>
                    <BoardConditionForm setPage={setPage} setStartDate={setStartDate} setEndDate={setEndDate} 
                        setTitle={setTitle} setuserID={setuserID}/>
                    <BoardLimit setLimit={setLimit}/>
                    <BoardTable bbslist={bbslist} setorderTarget={setorderTarget} setorderValue={setorderValue}
                        orderTarget={orderTarget} orderValue={orderValue}/>
                    <BoardPage curpage={curpage} maxpage={maxpage} setPage={setPage}/>
                </div>
            </div>) : (<div></div>)
    )
}
export default BoardMain;