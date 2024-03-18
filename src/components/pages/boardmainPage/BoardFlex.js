import React, { useState, useEffect,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BoardFlexData from './BoardFlexData';
import axios from 'axios';
function BoardFlex(props){
  const [tags, settags] = useState([])

  const [curtag, setcurtag] = useState(props.curtag);
  const [curpage, setPage] = useState(1);  //현재 페이지
  const count = useRef(0);
  const infiniteScrollRef = useRef(null);
  const [maxpage, setMaxPage] = useState(1);  //마지막 페이지
  const [limit, setLimit] = useState(5);  // 컨텐츠 갯수
  const [bbslist, setBbslist] = useState([]);  //컨텐츠

  const navigate = useNavigate();
  let tmparr = useRef([]);
  const flg = useRef(false);

  // Order Flg
  const [orderTarget, setorderTarget] = useState('bbsID'); //정렬하고자 하는 컬럼
  const [orderValue, setorderValue] = useState('DESC');   //오름차순, 내림차순
  const [IsRender, setIsRender] = useState(false);
  const firstRender = useRef(true);

  useEffect(() => {
    infiniteScrollRef.current = infiniteScroll
    document.addEventListener('scroll', infiniteScrollRef.current);   
    infiniteScroll();
    gethashTagGroup();
    return () => document.removeEventListener('scroll', infiniteScrollRef.current) ;
  
  }, []);

  useEffect(() => {
    flg.current = false;
    if (curpage == 0) {
      setPage(1);
      return;
    }
    
    if (curtag == '전체보기' || props.input != ''){
      selectBbsListCountSubmit();
      selectBbsListSubmit();
    }else{
      bbsConditionInputCount();
      bbsConditionInput();
    }
    
  }, [curpage])

  useEffect(() => {

    if (firstRender.current) {
      return;
  }
    if (props.input != '' && curtag != '전체보기'){
      setcurtag('전체보기');
      return
    }
    setPage(0);
  }, [props.input,curtag,props.userID])

  useEffect(() => {
    setcurtag(props.curtag);
  }, [props.curtag])

  const bbsConditionInputCount = () => {
    const url = '/board/bbsConditionInputCount';
    const data = {
        userID: props.userID,
        curtab:props.curtab,
        option:props.option,
        input:curtag,
        limit: limit,
        page: curpage,
        orderTarget: orderTarget,
        orderValue: orderValue
        }
    axios.post(url, data, { withCredentials: true })
    .then((response) => {
      count.current = Math.ceil(response.data[0].COUNT / 5) ;
      if (props.curtab === "board") props.setCount(response.data[0].COUNT );
  })
  }
  const bbsConditionInput = () => {
    const url = '/board/bbsConditionInput';
    const data = {
        userID: props.userID,
        curtab:props.curtab,
        option:props.option,
        input:curtag,
        limit: limit,
        page: curpage,
        orderTarget: orderTarget,
        orderValue: orderValue
        }
    axios.post(url, data, { withCredentials: true })
      .then((response) => {
        if (curpage == 1) tmparr.current = [];
        let newContents = Array.from(tmparr.current);
        response.data.forEach((e) => {
            newContents.push(e);
            tmparr.current.push(e)
        })
        setBbslist(newContents);
        firstRender.current = false;
      })
  }
  const infiniteScroll = () => {
    const { scrollHeight } = document.documentElement;
    const { scrollTop } = (document.documentElement);
    const { clientHeight } = document.documentElement;
    console.log(window.innerHeight, document.body.clientHeight, window.screen.availHeight );
    if (scrollTop === 0 ) return
    let y = Math.ceil(scrollTop);
    if ((scrollHeight - clientHeight) - y <= 0 ){

      flg.current = true;
      setPage((curpage) => {
        if (curpage < count.current) {
          return curpage + 1; // 업데이트된 값을 반환하여 setPage로 전달
        } else {

          return curpage; // 아무런 변경 없이 현재 값을 반환
        }
      });
      
    }
}
  const gethashTagGroup = () => {
    const url = '/profile/gethashTagGroup';
    const data = {
        userID: props.userID,
      };
    axios.post(url, data, { withCredentials: true })
      .then((resp)=>{
        let total = 0
        let newContents = new Array()
          resp.data.forEach((e) => {
          newContents.push(e);
          total += e.COUNT
          })
        newContents.unshift({hashTag : '전체보기', COUNT:total})
        settags(newContents);     
      })
  }
  const selectBbsList = () => {
    const url = '/board/bbsConditionList';
    const data = {
        userID: props.userID,
        curtab:props.curtab,
        option:props.option,
        input:props.input,
        limit: limit,
        page: curpage,
        orderTarget: orderTarget,
        orderValue: orderValue
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
            else {
              if (curpage == 1) tmparr.current = [];
              let newContents = Array.from(tmparr.current);
              response.data.forEach((e) => {
                  newContents.push(e);
                  tmparr.current.push(e)
              })
              setBbslist(newContents);
              firstRender.current = false;
            }
        })
}

const selectBbsListCount = () => {
    const url = '/board/bbsListCount';
    const data = {
        userID: props.userID,
        curtab:props.curtab,
        option:props.option,
        input:props.input,
        limit: limit,
        page: curpage,
        orderTarget: orderTarget,
        orderValue: orderValue
      };
    return axios.post(url, data, { withCredentials: true });
}

const selectBbsListCountSubmit = () => {
    selectBbsListCount()
        .then((response) => {
            if (response.data === false) {
                alert("에러 발생");
                navigate('/Main');
            }
            count.current = Math.ceil(response.data[0].COUNT / 5) ;
        })
}
  return (
    <div  className={'BoardFlex-container'+(props.curtab == 'board' ? ' active': '')}>
      {props.curtab == 'myboard' ? 
        <div className='BoardFlex-tag-container'>
          <div className='BoardFlex-tag-title'>
            <h3>태그목록</h3>
          </div>
          <div className='BoardFlex-tag-content'>
            {tags.map((tag, key)=>{
              return <div onClick={()=> {setcurtag(tag.hashTag)}} key={key} className={'tag-content' + (tag.hashTag == curtag ? " active" : "")}><span>{tag.hashTag}</span> <span style={{color:'rgb(134, 142, 150)', marginLeft:'5px', fontSize:'14px'}}>({tag.COUNT})</span></div>
            })}
          </div>

        </div>
        : <div></div>}
        
        <div className='BoardFlex-bbs-container'>
          {bbslist.map((item,key)=>{
            return <BoardFlexData key={key} item={item}/>
          })}
          
        </div>
    </div>
  )
}

export default BoardFlex;