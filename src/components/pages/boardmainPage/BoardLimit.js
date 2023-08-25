import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown';

function BoardLimit(props) {
    console.log("limit");
    const limitValueHandle = (e) => {
        props.setLimit(parseInt(e.target.name));
    }
    return (
        <div style={{ marginLeft: 'auto' }}>
            <div >
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">

                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item as="button" name='5' onClick={limitValueHandle}>5</Dropdown.Item>
                        <Dropdown.Item as="button" name='10' onClick={limitValueHandle}>10</Dropdown.Item>
                        <Dropdown.Item as="button" name='15' onClick={limitValueHandle}>15</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>
    )
}

export default React.memo(BoardLimit);