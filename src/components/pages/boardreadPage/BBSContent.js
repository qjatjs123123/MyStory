import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function BBSContent(props) {
    const [bbsTitle, setbbsTitle] = useState('');
    const [bbsContent, setbbsContent] = useState('');
    const [userID, setuserID] = useState('');
    const [bbsDate, setbbsDate] = useState('');
    const [tag, settag] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {      
        selectBbsIDInfoSubmit();    

    }, []);

    const selectBbsIDInfo = () => {
        const url = '/board/selectBbsIDInfo';
        const data = {
            bbsID: props.bbsID
        }
        return axios.post(url, data, { withCredentials: true });
    }
    const selectBbsIDInfoSubmit = () => {
        selectBbsIDInfo()
            .then((response) => {
                if (response.data === false) {
                    alert("에러 발생");
                    navigate('/Main');
                } else if (response.data.length === 0) {
                    alert("삭제된 게시물 입니다.");
                    navigate('/board');
                } else {
                    setbbsTitle(response.data[0].bbsTitle);
                    setbbsContent(response.data[0].bbsContent);
                    setuserID(response.data[0].userID);
                    setbbsDate(dateFormat(new Date(response.data[0].bbsDate)));
                    let newContents = Array.from(tag);
                    response.data.forEach((e) => {
                        newContents.push(e.hashTag);
                    })
                    settag(newContents)
                }
            })
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

    return (
        <div style={{ width: '60%' }}>
            <h3 style={{ marginTop: '50px', fontWeight: 'bolder', marginBottom: '20px' }}>내용</h3>
            <div style={{ borderTop: '5px solid black' }}>
                <div style={{ marginTop: '20px', borderBottom: '1px solid black' }}>
                    <h5 style={{ fontWeight: 'bold' }}>{bbsTitle}
                        {props.curuserID === userID ? <Button onClick={() => props.MoveToBbsUpdate(bbsTitle,bbsContent)} size="sm" style={{ marginLeft: '10px' }} variant="dark">글수정</Button> : null}
                        {props.curuserID === userID ? <Button onClick={props.bbsDeleteSubmit} size="sm" style={{ marginLeft: '10px' }} variant="danger">글삭제</Button> : null}
                    </h5>
                    <div style={{ marginBottom: '20px' }}>{userID} | {bbsDate}</div>
                    <div className='table-data-info-hashtag'>
                        {tag.map((tag,idx)=>{
                            return <div onClick={() => navigate(`/tags/${tag}`)} key ={idx}>{tag} </div>
                        })}
                    </div>
                </div>
                <div style={{ marginTop: '20px' }} dangerouslySetInnerHTML={{ __html: bbsContent }} />
            </div>
        </div>
    );
}

export default BBSContent;