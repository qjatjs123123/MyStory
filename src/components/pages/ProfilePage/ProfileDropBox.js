import React, { useState, useEffect,useRef } from 'react';

function ProfileDropBox(props){
  const [curdropbox, setcurdropbox] = useState('')

  const [active, setactive] = useState(false);
  const dropboxcontent_bbs = props.arr;
  const curtab = props.curtab;
  const inputref = useRef(null);
  useEffect(() => {
    // 컴포넌트가 마운트될 때 이벤트 리스너를 추가합니다.
    document.body.addEventListener('click', handleBodyClick);

    // 컴포넌트가 언마운트될 때 이벤트 리스너를 제거합니다.
    return () => {
      document.body.removeEventListener('click', handleBodyClick);
    };
}, []); // 빈 배열은 컴포넌트가 마운트될 때 한 번만 실행됨을 의미합니다.
const handleBodyClick = (e) => {
    // body 태그가 클릭될 때 실행할 코드를 작성합니다.

    setactive(false);
  };
  useEffect(()=>{
    setcurdropbox(props.curdropbox);
  },[props.arr])
  const focushandler = (e) => {
    e.target.parentElement.querySelector('.fa').style.color="black";
    e.target.parentElement.style.border="2px solid black"
  }
  const blurhandler = (e) => {
    
    e.target.parentElement.querySelector('.fa').style.color="#adb5bd";
    e.target.parentElement.style.border="2px solid #adb5bd"
  }
  
  return (
    <div className={'tab-search-container-main' + (curtab == 'write' || curtab =='history' ? " notshow" : "")}>
      <div onClick={(e)=>{e.stopPropagation(); setactive(!active)}} className='tab-search-container-dropbox'>
        <div className='tab-search-container-inner'>
          <span>{curdropbox}</span>
          <i className="fa fa-caret-down"></i>
        </div>
        <div className= {'tab-dropbox-drop' + (active == true ? " active" : "")}>
          {dropboxcontent_bbs.map((data, idx)=>{
            return <div onClick={() => {props.condselectSubmit('',data); inputref.current.value=''}} className={data==curdropbox ? " target" : ""} key={idx}>{data}</div>
          })}
        </div>
      </div>
      <div className='tab-search-container'>     
        <i className="fa fa-search"></i>
        <input ref={inputref} onChange={(e) => props.condselectSubmit(e.target.value,curdropbox)} onFocus={focushandler} onBlur={blurhandler} placeholder={curdropbox+'를 입력하세요'} className='search-input'></input>
      </div>
    </div>
  )
}

export default ProfileDropBox