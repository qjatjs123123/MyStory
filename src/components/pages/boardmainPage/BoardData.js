import React, { useState, useEffect } from 'react';

function BoardData(props) {
    const dateFormat = (param) => {
        const date = new Date(param);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }
    return (
        <tr onClick = {props.readClick}>
            <td >{props.num}</td>
            <td>{props.title}</td>
            <td>{props.name}</td>
            <td>{dateFormat(props.date)}</td>
        </tr>
    )
}

export default BoardData;