import axios from 'axios';
import React, { useState, useEffect, useRef, useMemo } from 'react';

function BoardWriteModal(props){
  
  const [img, setimg] = useState("");
  const [mainImg,setMainImg] = useState(process.env.PUBLIC_URL+'/images/noimage.png');
  const [tags, settags] = useState([]);
  const inputref = useRef();
  const previewimgbtn = useRef();
  const inputfile = useRef();

  const taginput = (e) => {
    if (tags.length >= 10) return;
    if(window.event.keyCode == 13){
      let newContents = new Set(tags);
      newContents.add(e.target.value)  
      settags([...newContents]);
      e.target.value='';
    }
      
  }
  const deletetag = (tag) => {
    const newtags = tags.filter((data) => {
      return data !== tag;
    })
    settags(newtags);
  }

  const writesubmit = async() => {
    if (tags.length === 0){
      inputref.current.focus();
      return;
    }
    let IMG_URL = process.env.PUBLIC_URL+'/images/noimage.png';
      try {
        if (img != ''){
          const file = img;
          // multer에 맞는 형식으로 데이터 만들어준다.
          const formData = new FormData();
          formData.append('img', file); // formData는 키-밸류 구조
          const result = await axios.post('/board/bbsContentImage', formData);
          IMG_URL = result.data.url;
        }
        } catch (error) {
            console.log('실패했어요ㅠ');
        }
        setMainImg('');
    props.bbsWriteSubmit(IMG_URL, tags)
  }

  const imgPreviewDelete = () => {
    setMainImg(process.env.PUBLIC_URL+'/images/noimage.png');
    setimg(process.env.PUBLIC_URL+'/images/noimage.png');
    inputfile.current.value = '';
  }

  const imageHandler = (event) => {
    event.preventDefault();
    var reader = new FileReader();

    reader.onload = function(event) {
        setMainImg(event.target.result);
    };
    if (event.target.files[0] == null ) return
    setimg(event.target.files[0]);
    reader.readAsDataURL(event.target.files[0]);
};
  return (
    <div onClick={() => {props.setactive(false)}} className={'modal-container' + (props.active == true ? " active" : "")}>
      <div onClick={(e)=>{e.stopPropagation()}} className='modal-content'>
        <div className='modal-image-box'>
          <div className='modal-image-box-title'>
            <h3>썸네일 업로드</h3>
          </div>
          <div className='modal-image-box-input'>
            <input ref={inputfile} onChange={imageHandler}  type="file"></input>
          </div>
          <div className='modal-image-box-title'>
            <h3>썸네일 미리보기</h3>
            <div ref={previewimgbtn} onClick={imgPreviewDelete}>제거</div>
          </div>
          <img className='profilePreview' src={mainImg} alt=""  style={{maxWidth:"300px"}}></img>
        </div>
        <div className='modal-hashtag-box'>
          <div className='modal-image-box-title'>
            <h3>해시태그</h3>
          </div>
          <div className='modal-hashtag-box-content'>
            {tags.map((tag, idx) => {
              return <div onClick={()=>{deletetag(tag)}} key={idx}>{tag}</div>
            })}
            
          </div>
          <input ref={inputref} onKeyUp={taginput} type="text" placeholder='태그를 입력하세요'></input>
          <div className='modal-hashtag-box-buttongroup'>
            <button onClick={() => {props.setactive(false)}} className='cancel'>취소</button>
            <button onClick={writesubmit} className='submit'>출간하기</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BoardWriteModal;