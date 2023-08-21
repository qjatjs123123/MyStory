import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

function Board(){
    //page,limit
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);

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
        <div style={{width:'80%', textAlign:'center',marginLeft:'10%',display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
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
      <Page page = {page} limit = {limit}/>
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

function Page() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
      <div>
            <ButtonGroup aria-label="Basic example"  size="lg">
                <Button variant="secondary" active="false">이전</Button>
                <Button onClick={handleShow} variant="secondary">1</Button>
                <Button variant="secondary">다음</Button>
            </ButtonGroup>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                <Modal.Title>페이지 이동</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{textAlign:'center'}}>
                    <Form.Control style={{marginBottom:'15px'}} type="text" placeholder="이동할 페이지를 입력하세요" />
                    <span >현재 <span style={{color:'red'}}>1 Page</span> / 최대 <span style={{color:'red'}}>30 Page</span></span>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    닫기
                </Button>
                <Button variant="primary">이동</Button>
                </Modal.Footer>
            </Modal>
      </div>
    );
  }

  

export default Board;