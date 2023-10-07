import axios from 'axios';
import React, { useState, useEffect,useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BoardFlex from '../boardmainPage/BoardFlex';

function HashtagPage(){
  const { hashTag } = useParams();

  return (
    <div className='bbs-container'>
      <div className='tags-inner'>
        <div className='tags-content-container'>
          <h1>
            # {hashTag}
          </h1>
          <div className='tags-content-countinfo'>
            <span>총 862개 게시물</span>
          </div>
          <BoardFlex curtag = {hashTag} input={''} curtab={'board'}/>
        </div>
      </div>
    </div>
  )
}

export default HashtagPage;