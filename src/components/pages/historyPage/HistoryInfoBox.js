import { useNavigate } from 'react-router-dom';
function HistoryInfoBox(props){
  const navigate = useNavigate();
  const dateFormat = (param) => {
    const date = new Date(param);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
}

const replaceHTML = (param) => {
    const newText = props.data.bbsContent.replace(/<[^>]*>?/g, '');
    return newText
}
  return (
    <div style={{marginBottom:"40px"}} className='history-content-container-inner'>
      <div onClick={() => navigate(`/Profile/${props.data.userID}`)} className='history-content-userbox'>
        <img src={props.data.bbsImage}></img>
        <div className='history-content-userbox-text'>
          <div style={{fontWeight:"800", fontSize:"20px"}}>{props.data.userID}<span  style={{fontWeight:"normal", fontSize:"14px", color:'#7a7a7a', marginLeft:'10px'}}>(새로운 게시물)</span></div>
          <div style={{fontWeight:"normal", fontSize:"14px", color:'#7a7a7a', transform:'translateY(5px)'}}>{dateFormat(props.data.historyDate)}</div>
        </div>
      </div>
      <div onClick={() => { navigate(`/BoardRead/?bbsID=${props.data.bbsID}`) }} className='history-content-contentbox'>
        <img src={process.env.PUBLIC_URL+'/images/logo-title.png'}></img>
        <div className='history-content-contentbox-text'>
          <div style={{fontWeight:"600"}}>{props.data.bbsTitle}</div>
          <div style={{fontSize:'12px'}}>{replaceHTML()}</div>
        </div>
      </div>
    </div>
  )
}

export default HistoryInfoBox;