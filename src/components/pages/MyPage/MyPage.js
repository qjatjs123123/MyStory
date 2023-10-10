import React, { useState, useEffect,useRef } from 'react';
import Join from '../memberPage/Join';

function MyPage(props){
  return (
    <div>
      <Join mypage={true} userID = {props.userID} setcount={props.setcount}/>
    </div>
  )

}

export default MyPage;