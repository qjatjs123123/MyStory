import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

let total = 0;
let curpage = 0;
let flg1 = false;
let initflg = false;
function BoardRead(props) {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [bbsID, setBbsID] = useState(queryParams.get('bbsID'));
    const [bbsTitle, setbbsTitle] = useState('');
    const [bbsContent, setbbsContent] = useState('');
    const [userID, setuserID] = useState('');
    const [bbsDate, setbbsDate] = useState('');
    const [isLogin, setLogin] = useState(false);
    const [curuserID, setCuruserID] = useState('');
    const [replyData, setReplyData] = useState([]);
    const [rereplyData, setrereplyData] = useState(new Map());
    const [page , setpage] = useState(0);
    const [replyTotal , setreplyTotal] = useState(0);
    const [flg , setflg] = useState(false);
    const [replyflg, setreplyflg] = useState(false);
    const [reommendflg, setreommendflg] = useState(false);
    const [good, setgood] = useState(0);
    const [bad, setbad] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        document.addEventListener('scroll', infiniteScroll);
        loginCheckSubmit();
        selectBbsIDInfoSubmit();

    }, []);

    useEffect (() =>{
        selectrecommendSubmit();
    },[reommendflg])
    useEffect(() => {
        curpage=page;
        initflg = false;
        if(page === -1){
            setpage(0);
            return;
        }
        loginCheckSubmit();
        selectReplyDataSubmit();
        selectreReplyDataSubmit();
        selectreplyTotalSubmit();
    }, [page])

    const init = () =>{
        //setreplyflg(!replyflg);
        initflg = true;
        setrereplyData(new Map());
        setReplyData([]);
        setpage(-1);
    }

    const infiniteScroll = () => {
        if (parseInt(total / 5) < curpage || flg1===false || initflg === true) return;
        const { scrollHeight } = document.documentElement;
        const { scrollTop } = (document.documentElement);
        const { clientHeight } = document.documentElement;
        let y = Math.ceil(scrollTop);
        if (y >= scrollHeight - clientHeight) {
            setpage(page => page + 1);  
           // document.removeEventListener('scroll', infiniteScroll)   ;
        };
    }

    const selectrecommend = () =>{
        const url = '/board/selectrecommend';
        const data = {bbsID: parseInt(bbsID),};
        return axios.post(url, data, { withCredentials: true });
    }

    const selectrecommendSubmit = () =>{
        selectrecommend()
            .then((response) => {   
                setgood(response.data[0].bbsGood);  
                setbad(response.data[0].bbsBad);  
            })
    }

    const selectreplyTotal = () =>{
        const url = '/board/selectreplyTotal';
        const data = {bbsID: parseInt(bbsID),};
        return axios.post(url, data, { withCredentials: true });
    }

    const selectreplyTotalSubmit = () =>{
        selectreplyTotal()
            .then((response) => {          
                setreplyTotal(response.data[0].TOTAL);
                total = response.data[0].TOTAL;
            })
    }
    
    const selectreReplyData = () => {
        const url = '/board/selectreReplyData';
        const data = {bbsID: bbsID,
                    page: page};
        return axios.post(url, data, { withCredentials: true });
    }

    const selectreReplyDataSubmit = () => {
        selectreReplyData()
            .then((response) => {
                if (response.data === false) {
                    setLogin(false);
                    alert("다시 로그인 해주세요");
                    navigate('/Main');
                }
                else {
                    
                    let newContents = new Map(JSON.parse(JSON.stringify(Array.from(rereplyData))));
                    
                    response.data.forEach((e) => {
                        if (!newContents.has(e.replyID)) newContents.set(e.replyID, [e]);
                        else {
                            let newArray = Array.from(newContents.get(e.replyID));
                            newArray.push(e)
                            newContents.set(e.replyID, newArray);
                        }
                    })        
                    setrereplyData(newContents);   
                    console.log("qweqwe:",newContents);
                             
                }

            })
    }

    const selectReplyData = () => {
        const url = '/board/selectReplyData';
        const data = {bbsID: bbsID,
                    page: page};
        return axios.post(url, data, { withCredentials: true });
    }
    const selectReplyDataSubmit = () => {
        flg1 = false;
        selectReplyData()
            .then((response) => {
                if (response.data === false) {
                    setLogin(false);
                    alert("다시 로그인 해주세요");
                    navigate('/Main');
                }
                else {
                    let newContents = Array.from(replyData);
                    response.data.forEach((e) => {
                        newContents.push(e);
                    })       
                    setReplyData(newContents);
                    flg1 = true;
                }
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
                    setCuruserID(response.data);
                }
            })
    }
    const selectBbsIDInfo = () => {
        const url = '/board/selectBbsIDInfo';
        const data = {
            bbsID: bbsID
        }
        return axios.post(url, data, { withCredentials: true });
    }
    const MoveToBbsUpdate = () => {
        props.setbbsID(bbsID);
        props.setbbsTitle(bbsTitle);
        props.setbbsContent(bbsContent);
        navigate('/BoardWrite/Update');
    }

    const bbsDelete = () => {
        const url = '/board/bbsDelete';
        const data = {
            bbsID: bbsID
        }
        return axios.post(url, data, { withCredentials: true });
    }

    const bbsDeleteSubmit = (e) => {
        const result = window.confirm("정말로 삭제하시겠습니까?");
        if (result) {
            bbsDelete()
                .then((response) => {
                    if (response.data === true) {
                        alert("삭제 완료");
                        navigate('/board');
                    }
                    else {
                        alert("삭제 오류");
                        navigate('/board');
                    }
                })
        }
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
    const selectBbsIDInfoSubmit = () => {
        selectBbsIDInfo()
            .then((response) => {
                console.log(response.data);
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
                }
            })
    }
    return (
        isLogin ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <BoardContent bbsDeleteSubmit={bbsDeleteSubmit} MoveToBbsUpdate={MoveToBbsUpdate} curuserID={curuserID} content={bbsContent} bbsTitle={bbsTitle} userID={userID} bbsDate={bbsDate} />
                <EstimateContent reommendflg={reommendflg} bbsID={bbsID} curuserID={curuserID} setreommendflg={setreommendflg} good={good} bad={bad}/>
                <Reply init={init} bbsID={bbsID} curuserID={curuserID} replyTotal={replyTotal} replyData = {replyData} rereplyData={rereplyData} setrereplyData={setrereplyData}/>
            </div>
        ) : <div></div>


    )
}

function BoardContent(props) {
    return (
        <div style={{ width: '60%' }}>
            <h3 style={{ marginTop: '50px', fontWeight: 'bolder', marginBottom: '20px' }}>내용</h3>
            <div style={{ borderTop: '5px solid black' }}>
                <div style={{ marginTop: '20px', borderBottom: '1px solid black' }}>
                    <h5 style={{ fontWeight: 'bold' }}>{props.bbsTitle}
                        {props.curuserID === props.userID ? <Button onClick={props.MoveToBbsUpdate} size="sm" style={{ marginLeft: '10px' }} variant="dark">글수정</Button> : null}
                        {props.curuserID === props.userID ? <Button onClick={props.bbsDeleteSubmit} size="sm" style={{ marginLeft: '10px' }} variant="danger">글삭제</Button> : null}
                    </h5>
                    <div style={{ marginBottom: '20px' }}>{props.userID} | {props.bbsDate}</div>
                </div>
                <div style={{ marginTop: '20px' }} dangerouslySetInnerHTML={{ __html: props.content }} />
            </div>
        </div>
    );
}

function EstimateContent(props) {
    const insertRecommend = (flg) => {
        const url = '/board/insertRecommend';
        const data = {
            bbsID:props.bbsID,
            userID:props.curuserID,
            flg:flg
        };
        return axios.post(url, data, { withCredentials: true });
    }
    const insertRecommendSubmit = (e) => {
        
        insertRecommend(e.target.name)
            .then((response) => {
                if (response.data === 'already') alert("더이상 추천할 수 없습니다.");
                else if(response.data === true) props.setreommendflg(!props.reommendflg);
            })
    }
    return (
        <div style={{ marginTop: '20px' }}>
            <Card style={{ width: '18rem', background: 'ivory', border: '1px solid black' }}>
                <Card.Body style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ color: "red" }}>{props.good}</div>
                    <Button name='good' onClick = {insertRecommendSubmit} style={{ borderRadius: '50%', padding: '15px 15px', lineHeight: '1', marginRight: '5px', marginLeft: '15px' }} variant="primary">♥<br />추천</Button>
                    <Button name='bad'  onClick = {insertRecommendSubmit} style={{ borderRadius: '50%', padding: '15px 15px', lineHeight: '1', marginLeft: '5px', marginRight: '15px' }} variant="secondary">♡<br />비추</Button>
                    <div style={{}}>{props.bad}</div>
                </Card.Body>
            </Card>
        </div>
    )
}

function Reply(props) {
    const [inputReply, setinputReply] = useState('');
    
    const valueChange = (e) => {
        e.preventDefault();
        setinputReply(e.target.value);
    }

    const insertReply = () => {
        const url = '/board/insertReply';
        const data = {bbsID: parseInt(props.bbsID),
                      userID: props.curuserID,
                      replyContent: inputReply};
        return axios.post(url, data, { withCredentials: true });
    }

    const insertReplySubmit = () => {
        insertReply()
            .then((response) => {
                console.log(response.data);
                if(response.data === false) alert("댓글 실패");
                else{
                    setinputReply('');
                    props.init();}
                
            })
    }

    return (
        <div style={{ width: '60%', marginTop: '50px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <h3 style={{ fontWeight: 'bolder', marginRight: '5px' }}>댓글</h3>
                <div style={{ color: 'red' }}>{props.replyTotal}</div>
                <div>개</div>
            </div>
            <div style={{ borderTop: '5px solid black' }}>
                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'row' }}>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1" style={{ width: '90%' }}>
                        <Form.Label style={{ color: 'black' }}>댓글 작성</Form.Label><br />
                        <Form.Control onChange={valueChange} name='id' type="text" placeholder="댓글 추가..." style={{ borderColor: 'black', width: '100%' }} value={inputReply} />
                    </Form.Group>
                    <Button onClick={insertReplySubmit} type="submit" style={{ height: '38px', width: '10%', marginTop: '32px' }}>작성</Button>
                </div>
            </div>
            {props.replyData.map((c) => {
                return < ReplyContent setrereplyData={props.setrereplyData} rereplyDatatotal={props.rereplyData} replyID = {c.replyID} bbsID={props.bbsID} init={props.init} curuserID={props.curuserID} key={c.replyID} id ={c.userID} content= {c.replyContent} rereplyData = {props.rereplyData.get(c.replyID)} />
            })}
        </div>
    )
}

function ReplyContent(props) {
    const [showreReply, setshowreReply] = useState(false);
    const [inputReply, setinputReply] = useState('');
    
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
                let newContents = new Map(JSON.parse(JSON.stringify(Array.from(props.rereplyDatatotal))));
                newContents.set(props.replyID, response.data)
                props.setrereplyData(newContents);  
            })
    }

    const insertReply = () => {
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

    const insertreReplySubmit = () => {
        insertReply()
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
                        
                        {props.rereplyData != null ? props.rereplyData.map((c) => {
                            return < RereplyContent key={c.rereplyID} id={c.userID}  content={c.rereplyContent} />
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
                    <Button onClick={insertreReplySubmit} type="submit" style={{ height: '38px', width: '10%', marginTop: '32px' }}>작성</Button>
                </div> : <div></div>}
        </div>
    )

}

function RereplyContent(props) {
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
        </div>     
    )
}

export default BoardRead;