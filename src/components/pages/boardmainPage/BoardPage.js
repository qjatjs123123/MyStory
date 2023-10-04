

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

function BoardPage(props) {
    console.log("page");
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
    const plusPage = () => { if (props.curpage + 1 <= props.maxpage) { props.setPage(props.curpage + 1); } }
    const minusPage = () => { if (props.curpage > 1) { props.setPage(props.curpage - 1); } }

    const changeValue = (e) => {
        value = parseInt(e.target.value)
    }
    
    return (
        <div style={{marginTop:'20px'}}>
            <ButtonGroup aria-label="Basic example" size="lg">
                <Button onClick={minusPage} variant="secondary" disabled={props.curpage === 1 ? true : false}>이전</Button>
                <Button onClick={handleShow} variant="secondary">{props.curpage}</Button>
                <Button onClick={plusPage} variant="secondary" disabled={props.curpage === props.maxpage ? true : false}>다음</Button>
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

export default React.memo(BoardPage);