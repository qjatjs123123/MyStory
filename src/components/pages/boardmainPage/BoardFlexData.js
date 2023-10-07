import axios from 'axios';
import React, { useState, useEffect,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
function BoardFlexData(props){
  const [tags, settags] = useState([]);
  const [replycount, setreplycount] = useState(0);
  const navigate = useNavigate();
    useEffect(() => {
        getTags();
        getreplyCount()
    }, [props.item])
    const getreplyCount = () => {
      const url = '/profile/getreplyCount';
      const data = {
        bbsID: props.item.bbsID,
      };
      axios.post(url, data, { withCredentials: true })
      .then((resp)=>{
        setreplycount(resp.data[0].COUNT);
      })
    }

    const getTags = () => {
        const url = '/board/getTags';
        const data = {
            bbsID: props.item.bbsID,
        };
        axios.post(url, data, { withCredentials: true })
          .then((resp)=>{
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

const replaceHTML = (param) => {
    const newText = param.replace(/<[^>]*>?/g, '');
    return newText
}
  return(
    <div className='BoardFlexData-container'>
      <div onClick={() => { navigate(`/BoardRead/?bbsID=${props.item.bbsID}`) }} >
        <img src={props.item.bbsImage}></img>
        <div className="BoardFlexData-title">
          <h2>{props.item.bbsTitle}</h2>
        </div>
      </div>
      <div className="BoardFlexData-content">
        {replaceHTML(props.item.bbsContent)}
      </div>
      <div className='BoardFlexData-hash'>
        <div className='table-data-info-hashtag'>
          {tags.map((tag,idx)=>{
                return <div key ={idx}>{tag.hashTag} </div>
            })}
        </div>
      </div>
      <div className='BoardFlexData-info'>
        <span>{dateFormat(props.item.bbsDate)}</span>
        <span>{replycount}개의 댓글</span>
        <span>
          <i className="fa fa-thumbs-up"></i>
          <span>{props.item.bbsGood}</span>
          <i className="fa fa-thumbs-down"></i>
          <span>{props.item.bbsBad}</span>
        </span>
      </div>
    </div>
  )
}
export default BoardFlexData;