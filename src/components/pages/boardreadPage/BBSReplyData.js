import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import BBSReReplyData from './BBSReReplyData';

function BBSReplyData(props) {
    const [showreReply, setshowreReply] = useState(false);
    const [inputReply, setinputReply] = useState('');
    const [rereplyData, setrereplyData] = useState([]);
    useEffect (() =>{
        selectreReplySubmit();
    },[])
    const valueChange = (e) => {
        e.preventDefault();
        setinputReply(e.target.value);
    }
    const selectreReply = () => {
        const url = '/board/selectreReply';
        const data = {bbsID: parseInt(props.bbsID),
                      replyID: props.replyID 
                    };
        return axios.post(url, data, { withCredentials: true });
    }
    const selectreReplySubmit = () => {
        selectreReply()
            .then((response) =>{
                let newContents =Array.from(response.data);
                setrereplyData(newContents);  
                console.log("rereply", newContents);
            })
    }

    const insertReReply = () => {
        console.log("insertReply",props)
        const url = '/board/insertreReply';
        const data = {bbsID: parseInt(props.bbsID),
                      replyID: props.replyID ,
                      rereplyID: props.rereplyData !== undefined && props.rereplyData.length !==0 ? props.rereplyData.length +1 : 1,
                      userID: props.curuserID,
                      replyContent: inputReply
                    };
        return axios.post(url, data, { withCredentials: true });
    }

    const reReplyClick = () => {
        setshowreReply(!showreReply);
    }

    const insertReReplySubmit = () => {
        insertReReply()
            .then((response) => {
                if(response.data === false) alert("답글 실패");
                else{
                    setinputReply('');
                    selectreReplySubmit();
                    }
            })
    }
    return (
        <div style={{ borderBottom: '1px solid #999', marginBottom: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'row', fontSize: '1.2em' }}>
                <div>
                    {props.id}
                </div>
                <div style={{ marginLeft: '50px', fontWeight: 'bold' }}>
                    {props.content}
                </div>
            </div>

            <div style={{ marginLeft: "30px", marginTop: "10px" }}>
                <Card style={{ width: '100%',backgroundColor: 'rgb(240, 240, 230)', border: '1px solid black' }}>
                    <Card.Body>
                        
                    {rereplyData != null ? rereplyData.map((c) => {
                            console.log("qwe",c);
                            return < BBSReReplyData key={c.rereplyID} id={c.userID}  content={c.rereplyContent} />
                        }) : null}
                    </Card.Body>
                </Card>
            </div>

            
            <Button onClick={reReplyClick} variant="link">답글</Button>
            {showreReply === true ?
                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'row' }}>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1" style={{ width: '90%' }}>
                        <Form.Label style={{ color: 'black' }}>답글 작성</Form.Label><br />
                        <Form.Control onChange={valueChange} name='id' type="text" placeholder="답글 추가..." style={{ borderColor: 'black', width: '100%' }} value={inputReply}/>
                    </Form.Group>
                    <Button onClick={insertReReplySubmit} type="submit" style={{ height: '38px', width: '10%', marginTop: '32px' }}>작성</Button>
                </div> : <div></div>}
        </div>
    )

}

export default BBSReplyData;