

function ProfileTab(props){
  if (props.type == 'clock'){
    return (
      <div onClick = {() => {props.tabBarhandle('clock')}} 
      className={"tab" + (props.curtab == 'clock' ? " active" : "")}>
        <i className="fa fa-clock-o"></i>
        <span>최신</span>
      </div>
    )
  }else if (props.type == 'heart'){
    return (
      <div onClick = {() => {props.tabBarhandle('heart')}} 
      className={"tab" + (props.curtab == 'heart' ? " active" : "")}>
        <i className="fa fa-heart-o"></i>
        <span>인기</span>
      </div>
    )
  }else if (props.type == 'follow'){
    return (
      <div onClick = {() => {props.tabBarhandle('follow')}} 
      className={"tab" + (props.curtab == 'follow' ? " active" : "")}>
        <i className="fa fa-github-alt"></i>
        <span>내 팔로우</span>
      </div>
    )
  }

  




  
}

export default ProfileTab