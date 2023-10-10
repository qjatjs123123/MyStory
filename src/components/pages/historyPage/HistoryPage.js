import axios from 'axios';
import React, { useState, useEffect,useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserinfoBox from './UserinfoBox';
import HistoryInfoBox from './HistoryInfoBox';
import BoardPage from '../boardmainPage/BoardPage';

function HistoryPage(props){
  const [followlist,setfollowlist] = useState([]);
  const [historylist,sethistorylist] = useState([]);
  const [followpage, setfollowpage] = useState(1);
  const [followmaxpage, setfollowmaxpage] = useState(0);
  const [historypage, sethistorypage] = useState(1);
  const [historymaxpage, sethistorymaxpage] = useState(0);
  const tmparr = useRef([]);
  const morebtn = useRef('');
  useEffect(()=>{
    historySubmit();
  }, [historypage])

  useEffect(()=>{
    followSubmit();
  }, [followpage])

  useEffect(()=>{
    tmparr.current = [];
    followSubmit();
    historySubmit();
  }, [props.input])

  const historySubmit = () => {
    const url = '/history/gethistory';
    const data = {historypage: historypage, input:props.input};
    axios.post(url, data, { withCredentials: true })
      .then((resp)=>{
        let newContents = Array.from(tmparr.current);
        resp.data.rows.forEach((e) => {
          newContents.push(e);
          tmparr.current.push(e)
        })
        sethistorylist(newContents);
        sethistorymaxpage(Math.ceil(resp.data.historyCount / 15));
        if (morebtn.current != null) morebtn.current.textContent   = 'More'

      })
  }
  const morebtnhandle = () => {
    sethistorypage(historypage + 1);
    if (morebtn.current != null) morebtn.current.textContent   = 'Loading more...'
  }
  const followSubmit = () => {
      const url = '/history/getfollowlist';
      const data = {followpage:followpage, input:props.input};
      axios.post(url, data, { withCredentials: true })
        .then((resp)=>{
          setfollowlist(resp.data.follow);
          setfollowmaxpage(Math.ceil(resp.data.followcount / 15))
          
        })
    }
  return (
    <div className='history-container'>
      <div className='history-inner'>
        <div className='history-user-container'>
          {followlist.map((data, idx)=>{
            return <UserinfoBox key={idx} data={data}/>
          })}
          {followmaxpage > 1 ? 
          <div style={{margin:"0 auto", width:'200px'}}>
          < BoardPage curpage={followpage} maxpage={followmaxpage} setPage={setfollowpage}/>
          </div> : <></>
          }
           {followmaxpage == 0 ? <div>검색결과가 없습니다.</div> : <></>}
          <div style={{width:'200px',height:'50px'}}></div>
        </div>
        <div className='history-content-container'>
          {historylist.map((data, idx)=>{
            return <HistoryInfoBox key={idx} data={data}/>
          })}
          {historymaxpage == historypage || historymaxpage == 0
          ? <></> 
          : <div ref={morebtn} onClick={morebtnhandle} className='morebtn'>More</div>}
          {historymaxpage == 0 ? <div>검색결과가 없습니다.</div> : <></>}
          <div style={{width:'200px',height:'50px'}}></div>
        </div>
      </div>
    </div>
  )
}

export default HistoryPage;