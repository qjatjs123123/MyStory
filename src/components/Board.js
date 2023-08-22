import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from  "react-datepicker";
import '../datepicker.css';
import ko from 'date-fns/locale/ko';
registerLocale('ko', ko);

function Board() {
    //page,limit
    const [curpage, setPage] = useState(1);
    const [maxpage, setMaxPage] = useState(1);
    const [limit, setLimit] = useState(3);
    const [bbslist, setBbslist] = useState([]);
    const [isLogin, setLogin] = useState(false);
    const navigate = useNavigate();

    const [flg, setFlg] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [title, setTitle] = useState('');
    const [userID, setuserID] = useState('');


    useEffect(() => {
        console.log(curpage, limit);   
        if (curpage > maxpage) setPage(maxpage);
        loginCheckSubmit();
        selectBbsListSubmit();
        selectBbsListCountSubmit();
    }, [curpage, limit,flg]);

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
                if (Math.ceil(response.data[0].COUNT / limit) === 0) setMaxPage(1);
                else setMaxPage(Math.ceil(response.data[0].COUNT / limit));
            })
    }

    const selectBbsList = () => {
        const url = '/board/bbsConditionList';
        const data = {
            title: title,
            userID: userID,
            startDate: startDate !== null ?`${startDate.getFullYear()}-${startDate.getMonth()+1}-${startDate.getDate()} 00:00:00` : null,
            endDate: endDate !== null ?`${endDate.getFullYear()}-${endDate.getMonth()+1}-${endDate.getDate()} 23:59:59` : null,
            limit: limit,
            page: curpage
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

    const loginCheck = () => {
        const url = '/board/loginCheck';
        const data = {};
        return axios.post(url, data, { withCredentials: true });
    }
    const plusPage = () => { if (curpage + 1 <= maxpage) { setPage(curpage + 1); } }
    const minusPage = () => { if (curpage > 1) { setPage(curpage - 1); } }

    const loginCheckSubmit = () => {
        loginCheck()
            .then((response) => {
                if (response.data === false) {
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
                <div style={{ width: '80%', textAlign: 'center', marginLeft: '10%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h3 style={{ marginTop: '50px', fontWeight: 'bolder' }}>게시판</h3>
                    <SelectConditionForm flg={flg} setFlg = {setFlg} setPage={setPage} startDate = {startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} setTitle={setTitle} setuserID={setuserID}/>
                    <div style={{ marginLeft: 'auto' }}>
                        <PageLimit limit={limit} setLimit={setLimit} />
                    </div>
                    <Table striped bordered hover variant="dark" style={{ borderColor: 'white' }}>
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>제목</th>
                                <th>작성자</th>
                                <th>작성일</th>
                            </tr>
                        </thead>

                        <tbody>
                            {bbslist.map((c) => {
                                return <BbsData key={c.bbsID} num={c.bbsID} title={c.bbsTitle} name={c.userID} date={c.bbsDate} />
                            })}
                        </tbody>
                    </Table>
                    <Page curpage={curpage} maxpage={maxpage} limit={limit} plusPage={plusPage} minusPage={minusPage} setPage={setPage} />
                            
                </div></div>) : (<div></div>)
    )
}

function SelectConditionForm(props) {
    const valueHandle = (e) =>{
        if(e.target.name === 'title') props.setTitle(e.target.value);
        else if(e.target.name === 'id') props.setuserID(e.target.value);
    }


    const SelectConditionFormSubmit = (e) =>{
        e.preventDefault();
        props.setFlg(!props.flg);
        props.setPage(1);
        //console.log(`${props.startDate.getFullYear()}-${props.startDate.getMonth()+1}-${props.startDate.getDate()}`);
    } 
    return (
        <div style={{ width: '100%', textAlign: 'left'}}>
            <Form>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start',marginLeft:'40px'}}>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label style={{ color: 'black' }}>제목</Form.Label>
                        <Form.Control onChange={valueHandle} name = 'title' type="text" placeholder="제목" style={{ borderColor: 'black', minWidth:'100px'}} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1" style={{marginLeft:'50px'}}>
                        <Form.Label style={{ color: 'black' }}>작성자</Form.Label>
                        <Form.Control onChange={valueHandle} name = 'id' type="text" placeholder="작성자" style={{ borderColor: 'black' ,minWidth:'100px'}} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1" style={{marginLeft:'50px'}}>
                        <Form.Label style={{ color: 'black' }}>시작일자</Form.Label><br/>
                        <DatePicker style={{ borderColor: 'black' }} locale="ko" selected={props.startDate}  onChange={(date) => props.setStartDate(date)} dateFormat="yyyy-MM-dd" className="custom-datepicker"/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1" style={{marginLeft:'50px'}}>
                        <br/>
                        <Form.Label style={{ color: 'black' }}>~</Form.Label><br/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1" style={{marginLeft:'50px'}}>
                        <Form.Label style={{ color: 'black' }}>종료일자</Form.Label><br/>
                        <DatePicker style={{ borderColor: 'black' }} locale="ko" selected={props.endDate}  onChange={(date) => props.setEndDate(date)} dateFormat="yyyy-MM-dd" className="custom-datepicker"/>
                    </Form.Group>
                    <Button onClick={SelectConditionFormSubmit} type="submit" style={{marginLeft:'50px', width: '200px', marginTop: '30px', height: '40px' }}>찾기</Button>
                </div>
            </Form>
            
        </div>
    );
}

function BbsData(props) {
    const dateFormat = (param) => {
        const date = new Date(param);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }
    return (
        <tr >
            <td >{props.num}</td>
            <td>{props.title}</td>
            <td>{props.name}</td>
            <td>{dateFormat(props.date)}</td>
        </tr>
    )
}

function Page(props) {
    const [show, setShow] = useState(false);
    let value = 0;
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const changePage = () => {
        if (value >= 1 && value <= props.maxpage) {
            props.setPage(value);
            setShow(false);
        }
        else alert("다시 입력해주세요")

    }

    const changeValue = (e) => {
        value = parseInt(e.target.value)
    }

    return (
        <div>
            <ButtonGroup aria-label="Basic example" size="lg">
                <Button onClick={props.minusPage} variant="secondary" disabled={props.curpage === 1 ? true : false}>이전</Button>
                <Button onClick={handleShow} variant="secondary">{props.curpage}</Button>
                <Button onClick={props.plusPage} variant="secondary" disabled={props.curpage === props.maxpage ? true : false}>다음</Button>
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
                <Modal.Body style={{ textAlign: 'center' }}>
                    <Form.Control onChange={changeValue} style={{ marginBottom: '15px' }} type="text" placeholder="이동할 페이지를 입력하세요" />
                    <span >현재 <span style={{ color: 'red' }}>{props.curpage} Page</span> / 최대 <span style={{ color: 'red' }}>{props.maxpage} Page</span></span>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        닫기
                    </Button>
                    <Button onClick={changePage} variant="primary">이동</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

function PageLimit(props) {

    const limitValueHandle = (e) => {
        props.setLimit(parseInt(e.target.name));
    }

    // const limitValueHandle = (param) => () => {
    //     props.setLimit(param);
    // }
    return (
        <div >
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">

                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item as="button" name='3' onClick={limitValueHandle}>3</Dropdown.Item>
                    <Dropdown.Item as="button" name='6' onClick={limitValueHandle}>6</Dropdown.Item>
                    <Dropdown.Item as="button" name='9' onClick={limitValueHandle}>9</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
}

export default Board;