<div align="center">
<img src="https://github.com/user-attachments/assets/7b33b5b6-7d34-4630-9fa3-a557fa8e996d" width="600"/>
  <br/>
<img src="./public/images/logo.png" width="100" height="100"/>
  
### SNS 기반 블로그 서비 🖍️

[<img src="https://img.shields.io/badge/release-v0.0.0-ㅎㄱㄷ두?style=flat&logo=google-chrome&logoColor=white" />]() 
<br/> [<img src="https://img.shields.io/badge/프로젝트 기간-2023.08.17~2023.10.13-fab2ac?style=flat&logo=&logoColor=white" />]() <br/>
<img src="https://img.shields.io/badge/프로젝트-개인토이프로젝트-6aa84f?style=flat&logo=google-chrome&logoColor=white" />

</div> 


## 📝 목차
- [1. 프로젝트 개요](#1-프로젝트-개요)
- [2. 담당 역할](#2-담당-역할)
- [3. 프로젝트 화면 구성](#3-프로젝트-화면-구성)
- [4. 내가 사용한 기술 스택](#4-사용한-기술-스택)
- [5. 배운점](#5-배운점)
- [6. 회고](#6-회고)

다음과 같은 목차로 구성되어 있습니다.

<br />

## 🚀 프로젝트 개요
이 프로젝트는 `React, Node, DB설계, aws`를 학습하기 위한 `개인 토이 프로젝트`입니다.  
Velog의 주요 기능을 구현하며 `풀스택 개발`의 기본기를 다지고,  
실제 블로그 플랫폼이 제공하는 사용자 경험을 따라 만들어보는 프로젝트입니다.  
<br />


## 👨‍💻 담당 역할
💡 **자동 로그아웃 및 연장**
- JWT를 사용한 로그인 처리
- accessToken, refreshToken으로 로그인 연장

💡 **회원 관리**
- 회원가입
- 아이디 찾기
- Gmail API를 통한 비밀번호 인증

💡 **게시물 조회**
- 커버링 인덱스를 통한 페이징 처리

💡 **게시물 쓰기**
- React-quill을 통한 TextEditor 사용
- Multer를 통한 이미지 업로드

💡 **게시물 쓰기**
- 게시물 수정, 삭제
- 댓글 수정, 삭제
- 답글 수정, 삭제


💡 **해시태그**
- 해시태그 별 검색

- 💡 **팔로우**
- 팔로우 관리

- 💡 **히스토리**
- 팔로우 최근 히스토리 

<br />


<br />

## 🖥️ 화면 구성
|회원가입|
|:---:|
|<img src="https://github.com/user-attachments/assets/94af6e9e-98b2-47ec-88ca-c99e1dcadcc3" width="450"/>|
|회원가입 입력값 검증, 프로필 이미지 설정|

<br/>

|게시물 보기|
|:---:|
|<img src="https://github.com/user-attachments/assets/76ce9bd0-80f2-49cd-920d-5483469e89b0" width="450"/>|
|게시물 페이징 처리| 
<br/>

|게시물 조회, 댓글, 답글, 수정|
|:---:|
|<img src="https://github.com/user-attachments/assets/9b62732f-ce7a-48d5-a600-07aa0e3c07d2" width="450"/>|
|React-Quill을 통한 에디터, 댓글, 답글|

<br/>

|팔로우 관리|
|:---:|
|<img src="https://github.com/user-attachments/assets/758f972c-31f1-4691-b2d2-854a81a1d72c" width="450"/>|
|팔로우 검색, 팔로우 최근 히스토리 목록, 무한스크롤|

<br/>

|게시물 쓰기|
|:---:|
|<img src="https://github.com/user-attachments/assets/a0b6f055-aba2-4cad-ad61-d518ec3204eb" width="450"/>|
|React-Quill을 통한 게시물 쓰기, Multer 이미지 업로드, 해시태그|


## ⚙ 내가 사용한 기술 스택
### Backend
<div>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"> 
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white"> 
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white"> 
  <img src="https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white">
  <img src="https://img.shields.io/badge/Amazon EC2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white">
  <img src="https://img.shields.io/badge/AWS-%23232F3E.svg?style=for-the-badge&logo=amazonaws&logoColor=white">
</div>

### Frontend
<div> 
  <img src="https://img.shields.io/badge/React-%2361DAFB.svg?style=for-the-badge&logo=react&logoColor=white"> 
  <img src="https://img.shields.io/badge/CSS-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white"> 
  <img src="https://img.shields.io/badge/HTML-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white">
  <img src="https://img.shields.io/badge/JavaScript-%23F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black"> 
</div>

### Tools
<div>
  <img src="https://img.shields.io/badge/Git-%23F05032.svg?style=for-the-badge&logo=git&logoColor=white">
</div>

<br />

## 🤔 배운점
> ### 커넥션 풀
> - 커넥션 풀을 사용하면 일정량의 Connection 객체를 미리 생성하여 Pool 이라는 공간(캐시)에 저장해둔다
> - [코드 바로보기](https://github.com/qjatjs123123/MyStory/blob/main/db.js#L1-L22)
> - [articles](https://velog.io/@qjatjs123123/%EA%B0%9C%EB%B0%9C-%EC%9D%BC%EC%A7%80-%EA%B2%8C%EC%8B%9C%ED%8C%90%EC%BB%A4%EB%84%A5%EC%85%98-%ED%92%80)
<br />



## 📲 링크
| :: 시연                                                            |
| :------------------------------------------------------------------------------------- |
| :: [Youtube Link](https://youtu.be/TyQVO3QFEDo?si=9lLZNdxKwd-Ec96k) | 



