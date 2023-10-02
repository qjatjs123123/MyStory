function ProfileBox(){
  return(
    <div className='profilebox-outter'>
      <div className='profilebox-inner'>
        <div className='profilebox-image'></div>
        
        <div className='profilebox-state'>
          <div className="message-title">상태메시지</div>
          <div>asdasdasdasdasdasdasdasdasdasdasqweqweasasdasdasdasdasdasdasdasdasdasdasqweqweasasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasqweqweasasdasdasdasdasdasdasdasdasdasdasqweqweasasdasdasdasdasdasdasdasd</div>    
        </div>
        <div className='profilebox-info'>8개의 댓글</div>
        <div className='profilebox-nickname'>
          by <span>hong</span>
          </div>
        <div className="like-info">
          <span>
            <i className="fa fa-heart"></i>
          </span>
          <span>
            30
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProfileBox;