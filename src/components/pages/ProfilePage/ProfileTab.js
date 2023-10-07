import React, { useState, useEffect,useRef } from 'react';
import { useNavigate } from 'react-router-dom';


function ProfileTab(props){
  const navigate = useNavigate();
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
  }else if (props.type == 'board'){
    return (
      <div onClick = {() => {props.tabBarhandle('board')}} 
      className={"tab" + (props.curtab == 'board' ? " active" : "")}>
        <i className="fa fa-list-alt"></i>
        <span>게시물</span>
      </div>
    )
  }else if (props.type == 'myboard'){
    return (
      <div onClick = {() => {props.tabBarhandle('myboard')}} 
      className={"tab" + (props.curtab == 'myboard' ? " active" : "")}>
        <i className="fa fa-drupal"></i>
        <span>내 게시물</span>
      </div>
    )
  }else if (props.type == 'write'){
    return (
      <div onClick = {() => {props.tabBarhandle('write')}} 
      className={"tab" + (props.curtab == 'write' ? " active" : "")}>
        <i className="fa fa-pencil-square-o"></i>
        <span>글쓰기</span>
      </div>
    )
  }else if (props.type == 'home'){
    return (
      <div onClick = {() => {props.tabBarhandle('home')}} 
      className={"tab" + (props.curtab == 'home' ? " active" : "")}>
        <i className="fa fa-home"></i>
        <span>홈</span>
      </div>
    )
  }else if (props.type == 'history'){
    return (
      <div onClick = {() => {props.tabBarhandle('history')}} 
      className={"tab" + (props.curtab == 'history' ? " active" : "")}>
        <i className="fa fa-history"></i>
        <span style={{fontSize:'18px'}}>팔로우 활동</span>
      </div>
    )
  }

}

export default ProfileTab