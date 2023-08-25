
import Table from 'react-bootstrap/Table';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BoardData from './BoardData';

function BoardTable(props) {
    console.log("table");
    // Order Flg

    const navigate = useNavigate();

    //table
    

    const orderValueHandle = (param) => {
        if (param === props.orderTarget) props.orderValue === 'DESC' ? props.setorderValue('ASC') : props.setorderValue('DESC');
        else {
            props.setorderTarget(param);
            props.setorderValue('DESC');
        }

    }

    const printOrder = (param) => {
        if (param === props.orderTarget) {
            if (props.orderValue === 'DESC') return '(v)';
            else return '(^)';
        } else return
    }

    return (

        <Table striped bordered hover variant="dark" style={{ borderColor: 'white' }}>
            <thead>
                <tr>
                    <th onClick={() => orderValueHandle('bbsID')}>번호{printOrder('bbsID')}</th>
                    <th onClick={() => orderValueHandle('bbsTitle')}>제목{printOrder('bbsTitle')}</th>
                    <th onClick={() => orderValueHandle('userID')}>작성자{printOrder('userID')}</th>
                    <th onClick={() => orderValueHandle('bbsDate')}>작성일{printOrder('bbsDate')}</th>
                </tr>
            </thead>

            <tbody>
                {props.bbslist.map((c) => {
                    return <BoardData key={c.bbsID} num={c.bbsID} title={c.bbsTitle} name={c.userID} date={c.bbsDate} readClick={() => { navigate(`/BoardRead/?bbsID=${c.bbsID}`) }} />
                })}
            </tbody>
        </Table>

    )
}

export default BoardTable;