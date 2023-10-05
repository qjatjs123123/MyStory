import axios from 'axios';
import React, { useState, useEffect } from 'react';

function BoardData(props) {
    const [tags, settags] = useState([]);

    useEffect(() => {
        getTags();
    }, [])

    const getTags = () => {
        const url = '/board/getTags';
        const data = {
            bbsID: props.data.bbsID,
        };
        axios.post(url, data, { withCredentials: true })
            .then((resp)=>{
                console.log(resp.data);
                settags(resp.data);
            })
    }

    const dateFormat = (param) => {
        const date = new Date(param);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }

    const replaceHTML = () => {
        const newText = props.content.replace(/<[^>]*>?/g, '');
        return newText
    }

    return (
        <div onClick = {props.readClick} className='table-data'>
            <div className='table-data-image'>
                <img src={props.data.bbsImage}/>
            </div>
            <div className='table-data-content'>
                <div className='table-data-content-title'>
                    <h3>{props.title}</h3>
                        
                    
                </div>
                <div className='table-data-content-content'>
                    <span>
                        {replaceHTML()}
                    </span>
                </div>
                <div className='table-data-content-profile'>
                    
                    <img src={props.data.userProfile}/>
                    <div>
                        <span>
                            by {props.data.userID}
                        </span>
                        <span>
                            ({props.data.userNickname})
                        </span>
                    </div>
                </div>
            </div>
            <div className='table-data-info'>
                <div className='table-data-info-hashtag'>
                    {tags.map((tag,idx)=>{
                        return <div key ={idx}>{tag.hashTag} </div>
                    })}
                </div>
                <div className='table-data-info-date'>
                    {dateFormat(props.date)}
                </div>
                <div className='table-data-info-like'>
                    <i className="fa fa-thumbs-up"></i>
                    <span>{props.data.bbsGood}</span>
                    <i className="fa fa-thumbs-down"></i>
                    <span>{props.data.bbsBad}</span>
                </div>
                
            </div>
        </div>
        // <tr onClick = {props.readClick} className='table-data'>
        //     <td style={{width:'10%'}}>
        //         <img src={props.data.bbsImage}/>
        //     </td>
        //     <td style={{width:'70%'}}>{props.title} {replaceHTML()}</td>
        //     <td style={{width:'10%'}}>{props.name}</td>
        //     <td style={{width:'10%'}}>{dateFormat(props.date)}</td>
        // </tr>
    )
}

export default BoardData;