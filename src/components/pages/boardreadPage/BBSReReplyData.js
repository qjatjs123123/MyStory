import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BBSReReplyData(props) {
    const [inputReReply, setinputReReply] = useState(props.content);
    const [showreReply, setshowreReply] = useState(false);

    const valueChange = (e) => {
        e.preventDefault();
        setinputReReply(e.target.value);
    }

    const rereplyUpdate = () => {
        const url = '/board/rereplyUpdate';
        const data = {
            bbsID: props.bbsID,
            replyID: props.replyID,
            rereplyID: props.rereplyID,
            rereplyContent : inputReReply
        }
        return axios.post(url, data, { withCredentials: true });
    }

    const rereplyUpdateSubmit = (e) => {
        rereplyUpdate()
            .then((response) => {
                if (response.data === true) props.setdeleteflg(!props.deleteflg);
                else alert("수정 오류");
                setinputReReply('');
            })

    }

    const rereplyDelete = () => {
        const url = '/board/rereplyDelete';
        const data = {
            bbsID: props.bbsID,
            replyID: props.replyID,
            rereplyID: props.rereplyID
        }
        return axios.post(url, data, { withCredentials: true });
    }

    const rereplyDeleteSubmit = (e) => {
        const result = window.confirm("정말로 삭제하시겠습니까?");
        if (result) {
            rereplyDelete()
                .then((response) => {
                    if (response.data === true) props.setdeleteflg(!props.deleteflg);
                    else alert("삭제 오류");
                })
        }
    }

    const showClick = () =>{
        setshowreReply(!showreReply);
        setinputReReply(props.content);
    }

    return (
        <div style={{ borderBottom: '1px solid #999', marginBottom: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'row', fontSize: '1.2em' }}>
                <div>
                    {props.id}
                </div>
                <div style={{ marginLeft: '50px', fontWeight: 'bold' }}>
                    └ {props.content}
                </div>
            </div>

            {props.curuserID === props.id ?
                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'row' }}>
                    <Button onClick={showClick} style={{ borderColor:'rgb(240, 240, 230)', fontSize: '12px', height: '30px', width: '5%', }}size="sm" variant="outline-success"  >수정</Button>
                    <Button onClick={rereplyDeleteSubmit} style={{ borderColor:'rgb(240, 240, 230)', fontSize: '12px', height: '30px', width: '5%' }} variant="outline-danger" size="sm">삭제</Button>
                    {
                        showreReply ?
                            <div style={{ width: '90%', display: 'flex', flexDirection: 'row' }}>
                                <Form.Control onChange={valueChange} name='id' type="text" placeholder="답글 수정..." style={{ borderColor: 'black', width: '90%', height: '30px', marginLeft: '10px' }} value={inputReReply} />
                                <Button onClick={rereplyUpdateSubmit} style={{ fontSize: '12px', height: '30px' }} variant="outline-primary">수정</Button>{' '} </div>
                            : <div></div>
                    }
                </div> : <div></div>
            }
        </div>
    )
}

export default BBSReReplyData;