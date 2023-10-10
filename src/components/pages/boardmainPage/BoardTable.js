
import React, { useState, useEffect } from 'react';
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

    const handler = () => {
        console.log(props.bbslist, "QWeqwqeqwe");
        if (props.bbslist != '' && props.bbslist.length > 0){
            return props.bbslist.map((c,idx) => {
                return <BoardData setInput={props.setInput} key={idx} data={c} num={c.bbsID} title={c.bbsTitle} name={c.userID} date={c.bbsDate} content={c.bbsContent} readClick={() => { navigate(`/BoardRead/?bbsID=${c.bbsID}`) }} />
            })
        }else if (props.bbslist === ''){
        
            return <div style={{fontSize:'25px', color:'gray'}}></div>
        }else{

            return <div style={{fontSize:'25px', color:'gray'}}>검색 결과가 없습니다.</div>
        }
            
    }
    return (
        <div className='table-data-container'>
            {handler()}
            
        </div>
        // <Table striped bordered hover variant="dark" style={{ borderColor: 'white'}}>
        //     {/* <thead>
        //         <tr style={{height:'0px'}}>
        //             <th style={{width:'10%'}} onClick={() => orderValueHandle('bbsID')}>번호{printOrder('bbsID')}</th>
        //             <th style={{width:'60%'}} onClick={() => orderValueHandle('bbsTitle')}>제목{printOrder('bbsTitle')}</th>
        //             <th style={{width:'20%'}}   onClick={() => orderValueHandle('userID')}>작성자{printOrder('userID')}</th>
        //             <th  style={{width:'10%'}}  onClick={() => orderValueHandle('bbsDate')}>작성일{printOrder('bbsDate')}</th>

        //             <th style={{width:'10%', height:'0px'}}></th>
        //             <th style={{width:'60%'}}></th>
        //             <th style={{width:'20%'}}></th>
        //             <th  style={{width:'10%'}}></th>
        //         </tr>
        //     </thead> */}

        //     <tbody>
        //         {props.bbslist.map((c) => {
        //             return <BoardData key={c.bbsID} data={c} num={c.bbsID} title={c.bbsTitle} name={c.userID} date={c.bbsDate} content={c.bbsContent} readClick={() => { navigate(`/BoardRead/?bbsID=${c.bbsID}`) }} />
        //         })}
        //     </tbody>
        // </Table>

    )
}

export default BoardTable;