
import React, { useState, useEffect,useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BoardFlex from '../boardmainPage/BoardFlex';

function HashtagPage(){
  const { hashTag } = useParams();
  const [count, setCount] = useState(0);

  return (
    <div className='bbs-container'>
      <div className='tags-inner'>
        <div className='tags-content-container'>
          <h1>
            # {hashTag}
          </h1>
          <div className='tags-content-countinfo'>
            <span>총 {count}개 게시물</span>
          </div>
          <BoardFlex curtag = {hashTag} input={''} curtab={'board'} setCount={setCount}/>
        </div>
      </div>
    </div>
  )
}

export default HashtagPage;