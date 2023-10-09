import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Card, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import BBSReReplyData from './BBSReReplyData';

function BBSReplyData(props) {
    const [showreReply, setshowreReply] = useState(false);
    const [showForm, setshowForm] = useState(false);
    const [inputReply, setinputReply] = useState('');
    const [rereplyData, setrereplyData] = useState([]);
    const [deleteflg, setdeleteflg] = useState(false);
    const [deletereflyflg, setdeletereflyflg] = useState(false);
    const [inputReplyUpdate, setinputReplyUpdate] = useState(props.content);
    const [inputReplyChange, setinputReplyChange] = useState(props.content);
    const [isFirst , setisFirst] = useState(true);
    const [active , setactive] = useState(false);
    const inputref = useRef();
    useEffect (() =>{
        selectreReplySubmit();
    },[deleteflg])
    const focushandler = () => {
        setactive(true)

    }
    const blurhandler = () => {
        setactive(false)
    }
    const valueChange = (e) => {
        e.preventDefault();
        setinputReply(e.target.value);
    }

    const valueChangereply = (e) => {
        e.preventDefault();
        setinputReplyUpdate(e.target.value);
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

    const replyDelete = () => {
        const url = '/board/replyDelete';
        const data = {
            bbsID: props.bbsID,
            replyID: props.replyID
        }
        return axios.post(url, data, { withCredentials: true });
    }

    const replyDeleteSubmit = (e) => {
        const result = window.confirm("정말로 삭제하시겠습니까?");
        if (result) {
            replyDelete()
                .then((response) => {
                    if (response.data === true) {
                        setdeletereflyflg(true);
                        props.minusreplyTotal();
                    }
                    else alert("삭제 오류");
                })
        }
    }

    const replyUpdate = () => {
        const url = '/board/replyUpdate';
        const data = {
            bbsID: props.bbsID,
            replyID: props.replyID,
            replyContent : inputReplyUpdate
        }
        return axios.post(url, data, { withCredentials: true });
    }

    const replyUpdateSubmit = (e) => {
        replyUpdate()
            .then((response) => {
                console.log(response.data);
                if (response.data === false) alert("수정 오류")
                else {
                    setisFirst(false);
                    setinputReplyUpdate('');
                    setinputReplyChange(response.data[0].replyContent);
                }
                
            })

    }

    const showClick = () =>{
        setshowForm(!showForm)
        setinputReplyUpdate(inputReplyChange);
    }
    return (
        deletereflyflg  ? <div></div> :
        <div style={{ borderBottom: '1px solid #999', marginBottom: '10px'}}>
            <div style={{ display: 'flex', flexDirection: 'row', fontSize: '1.2em' }}>
                <div>
                    {props.id}
                </div>
                <div style={{ marginLeft: '50px', fontWeight: 'bold' }}>
                    {isFirst ? props.content: inputReplyChange}
                </div>
            </div>
            {props.curuserID === props.id ?
                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'row' }}>
                    <Button onClick={showClick} style={{ borderColor:'transparent', fontSize: '12px', height: '30px', width: '5%', }}size="sm" variant="outline-success"  >수정</Button>
                    <Button onClick={replyDeleteSubmit} style={{ borderColor:'transparent', fontSize: '12px', height: '30px', width: '5%' }} variant="outline-danger" size="sm">삭제</Button>
                    {
                        showForm ?
                            <div style={{ width: '90%', display: 'flex', flexDirection: 'row' }}>
                                <Form.Control onChange={valueChangereply} name='id' type="text" placeholder="답글 수정..." style={{ borderColor: 'black', width: '90%', height: '30px', marginLeft: '10px' }} value={inputReplyUpdate} />
                                <Button onClick={replyUpdateSubmit} style={{ fontSize: '12px', height: '30px' }} variant="outline-primary">수정</Button>{' '} </div>
                            : <div></div>
                    }
                </div> : <div></div>
            }
            <div style={{ marginLeft: "30px", marginTop: "10px" }}>
                <Card style={{ width: '100%',backgroundColor: '#eee', border: '1px solid black' }}>
                    <Card.Body>
                        
                    {rereplyData != null ? rereplyData.map((c) => {
                            return < BBSReReplyData replyID={props.replyID} deleteflg ={deleteflg} setdeleteflg={setdeleteflg} 
                                    rereplyID={c.rereplyID} curuserID={props.curuserID} 
                                    key={c.rereplyID} id={c.userID}  content={c.rereplyContent} bbsID={props.bbsID}/>
                        }) : null}
                    </Card.Body>
                </Card>
            </div>

            
            <Button onClick={reReplyClick} variant="link">답글</Button>
            {showreReply === true ?
                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'row' }}>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1" style={{ width: '90%' }}>
                        <Form.Label style={{ color: 'black' }}>답글 작성</Form.Label><br />
                        {/* <Form.Control onChange={valueChange} name='id' type="text" placeholder="답글 추가..." style={{ borderColor: 'black', width: '100%' }} value={inputReply}/> */}

                        <input onBlur={blurhandler} onFocus={focushandler} onChange={valueChange} name='id' type="text" placeholder="답글 추가..." style={{ borderColor: 'black', width: '100%' }} className='replyinput' value={inputReply} ref={inputref}/>
                        <div className='inputbarbox'>
                            <div className='inputbarleft-inner'>                       
                                <div className={'inputbarleft' + (active ? ' active':'' )}></div>                            
                            </div>
                            <div className='inputbarright-inner'>
                            <div className={'inputbarright' + (active ? ' active':'' )}></div>  
                            </div>
                        </div>


                    </Form.Group>
                    <Button onClick={insertReReplySubmit} type="submit" style={{ height: '38px', width: '10%', marginTop: '32px' }}>작성</Button>
                </div> : <div></div>}
        </div>
    )

}

export default BBSReplyData;