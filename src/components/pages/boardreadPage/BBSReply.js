import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import BBSReplyData from './BBSReplyData';

let curpage = 0;
let total = 0;
let flg1 = false;

function BBSReply(props) {
    const [inputReply, setinputReply] = useState('');
    const [replyData, setReplyData] = useState([]);
    const [page , setpage] = useState(0);
    const [replyTotal , setreplyTotal] = useState(0);
    const [active , setactive] = useState(false);
    const inputref = useRef();

    useEffect (() =>{
        document.addEventListener('scroll', infiniteScroll);   
        infiniteScroll();
        return () => document.removeEventListener('scroll', infiniteScroll) ;
    },[])

    useEffect (() =>{
        curpage=page;
        if(page === -1){
            setpage(0);
            return;
        }
        props.loginCheckSubmitProps();
        selectReplyDataSubmit();
        selectreplyTotalSubmit();
    },[page])

    const init = () =>{
        setReplyData([]);
        setpage(-1);
    }

    const focushandler = () => {
        setactive(true)

    }
    const blurhandler = () => {
        setactive(false)
    }
    const minusreplyTotal = () => {
        setreplyTotal(replyTotal-1);
    }
    const infiniteScroll = () => {
        
         const { scrollHeight } = document.documentElement;
         const { scrollTop } = (document.documentElement);
         const { clientHeight } = document.documentElement;
         let y = Math.ceil(scrollTop);
         if (parseInt(total / 5) < curpage || y === 0 || flg1===false) return;
         if (y >= scrollHeight - clientHeight) {
            setpage(page => page + 1);
         };
     }
     const selectreplyTotal = () =>{
        const url = '/board/selectreplyTotal';
        const data = {bbsID: parseInt(props.bbsID),};
        return axios.post(url, data, { withCredentials: true });
    }

    const selectreplyTotalSubmit = () =>{
        selectreplyTotal()
            .then((response) => {          
                setreplyTotal(response.data[0].TOTAL);
                total = response.data[0].TOTAL;
            })
    }
    
    const selectReplyData = () => {
        const url = '/board/selectReplyData';
        const data = {bbsID: props.bbsID,
                    page: page};
        return axios.post(url, data, { withCredentials: true });
    }

    const selectReplyDataSubmit = () => {
        flg1 = false;
        selectReplyData()
            .then((response) => {
                if (response.data === false) 
                    alert("서버 오류");
                else {
                    let newContents = Array.from(replyData);
                    response.data.forEach((e) => {
                        newContents.push(e);
                    })      
                    console.log(newContents); 
                    setReplyData(newContents);
                    flg1 = true;
                }
            })
    }
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
                    init();}
                
            })
    }


    return (
        <div style={{ width: '60%', marginTop: '50px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <h3 style={{ fontWeight: 'bolder', marginRight: '5px' }}>댓글</h3>
                <div style={{ color: 'red' }}>{replyTotal}</div>
                <div>개</div>
            </div>
            <div style={{ borderTop: '5px solid black' }}>
                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'row' }}>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1" style={{ width: '90%' }}>
                        <Form.Label style={{ color: 'black' }}>댓글 작성</Form.Label><br />
                        <input onBlur={blurhandler} onFocus={focushandler} onChange={valueChange} name='id' type="text" placeholder="댓글 추가..." style={{ borderColor: 'black', width: '100%' }} className='replyinput' value={inputReply} ref={inputref}/>
                        <div className='inputbarbox'>
                            <div className='inputbarleft-inner'>                       
                                <div className={'inputbarleft' + (active ? ' active':'' )}></div>                            
                            </div>
                            <div className='inputbarright-inner'>
                            <div className={'inputbarright' + (active ? ' active':'' )}></div>  
                            </div>
                        </div>
                    </Form.Group>
                    <Button onClick={insertReplySubmit} type="submit" style={{ height: '38px', width: '10%', marginTop: '32px' }}>작성</Button>
                </div>
            </div>
            {replyData.map((c) => {
                return <BBSReplyData minusreplyTotal={minusreplyTotal} replyID = {c.replyID} bbsID={props.bbsID} curuserID={props.curuserID} key={c.replyID} id ={c.userID} content= {c.replyContent} />
            })}
        </div>
    )
}

export default BBSReply;