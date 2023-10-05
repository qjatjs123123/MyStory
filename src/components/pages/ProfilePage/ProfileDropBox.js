import React, { useState, useEffect,useRef } from 'react';

function ProfileDropBox(props){
  const [curdropbox, setcurdropbox] = useState(props.arr[0])
  const [active, setactive] = useState(false);
  const dropboxcontent_bbs = props.arr;
  const curtab = props.curtab;
  useEffect(()=>{
    setcurdropbox(props.arr[0]);
  },[props.arr[0]])
  const focushandler = (e) => {
    e.target.parentElement.querySelector('.fa').style.color="black";
    e.target.parentElement.style.border="2px solid black"
  }
  const blurhandler = (e) => {
    
    e.target.parentElement.querySelector('.fa').style.color="#adb5bd";
    e.target.parentElement.style.border="2px solid #adb5bd"
  }
  
  return (
    <div className='tab-search-container-main'>
      <div onClick={()=>setactive(!active)} className='tab-search-container-dropbox'>
        <div className='tab-search-container-inner'>
          <span>{curdropbox}</span>
          <i className="fa fa-caret-down"></i>
        </div>
        <div className= {'tab-dropbox-drop' + (active == true ? " active" : "")}>
          {dropboxcontent_bbs.map((data, idx)=>{
            return <div onClick={() => setcurdropbox(data)} className={data==curdropbox ? " target" : ""} key={idx}>{data}</div>
          })}
        </div>
      </div>
      <div className='tab-search-container'>     
        <i className="fa fa-search"></i>
        <input onChange={(e) => props.condselectSubmit(e,curdropbox)} onFocus={focushandler} onBlur={blurhandler} placeholder={curdropbox+'를 입력하세요'} className='search-input'></input>
      </div>
    </div>
  )
}

export default ProfileDropBox