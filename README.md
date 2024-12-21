<div align="center">
<img src="https://github.com/user-attachments/assets/7b33b5b6-7d34-4630-9fa3-a557fa8e996d" width="600"/>
  <br/>
<img src="./public/images/logo.png" width="100" height="100"/>
  
### SNS 기반 블로그 서비스 🖍️

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
> - `커넥션 풀`을 사용하면 일정량의 Connection 객체를 미리 생성하여 Pool 이라는 공간(캐시)에 저장해둔다
> - [코드 바로보기](https://github.com/qjatjs123123/MyStory/blob/main/db.js#L1-L22)
> - [articles](https://velog.io/@qjatjs123123/%EA%B0%9C%EB%B0%9C-%EC%9D%BC%EC%A7%80-%EA%B2%8C%EC%8B%9C%ED%8C%90%EC%BB%A4%EB%84%A5%EC%85%98-%ED%92%80)
<br />

> ### Gmail API
> - `nodemailer`를 통한 Gamil API 이메일 전송
> - [코드 바로보기](https://github.com/qjatjs123123/MyStory/blob/main/routes/memberRouter.js#L25-L55)
> - [articles](https://velog.io/@qjatjs123123/%EA%B0%9C%EB%B0%9C-%EC%9D%BC%EC%A7%80-%EA%B2%8C%EC%8B%9C%ED%8C%90Gmail-API)
<br />

> ### 이메일을 통한 본인 인증 방법
> <img src="https://github.com/user-attachments/assets/b657da46-1e26-4440-a539-30480503d6d4" width="550"/>
> 
> - `악보공장` 웹 서비스의 이메일 인증 방식 구현
> - 비밀번호 찾기 시 본인 인증을 위해 이메일 인증을 진행하였습니다.
> - [코드 바로보기](https://github.com/qjatjs123123/MyStory/blob/main/routes/memberRouter.js#L57-L67)
> - [articles](https://velog.io/@qjatjs123123/%EA%B0%9C%EB%B0%9C-%EC%9D%BC%EC%A7%80-%EA%B2%8C%EC%8B%9C%ED%8C%90%EC%9D%B4%EB%A9%94%EC%9D%BC-%EC%9D%B8%EC%A6%9D)
<br />

> ### 민감한 데이터 암호화
> - `Bcrypt`를 통한 데이터 암호 
> - DB에 개인정보 암호화하여 저장
> - <a href="https://github.com/qjatjs123123/MyStory/blob/main/routes/memberRouter.js#L222-L234" target="_blank">코드 바로보기</a>
> - <a href="https://velog.io/@qjatjs123123/%EA%B0%9C%EB%B0%9C-%EC%9D%BC%EC%A7%80-%EA%B2%8C%EC%8B%9C%ED%8C%90Bcrypt" target="_blank">articles</a>
<br />

> ### jwt
> - `jwt`를 통한 로그인 처리
> - `jwt`와 `session` 차이
> - `accessToken`과 `refreshToken`으로 로그인 연장
> - [코드 바로보기](https://github.com/qjatjs123123/MyStory/blob/main/routes/memberRouter.js#L121-L186)
> - [articles](https://velog.io/@qjatjs123123/%EA%B0%9C%EB%B0%9C-%EC%9D%BC%EC%A7%80-%EA%B2%8C%EC%8B%9C%ED%8C%90jwt)
<br />

> ### Cookie-parser
> - 클라이언트에서 서버로 요청을 보낼 때 쿠키를 포함
> - 서버에서 쿠키를 `cookie-parser`로 파싱하여 처리
> - `refreshToken` cookie값 parser하기
> - [코드 바로보기](https://github.com/qjatjs123123/MyStory/blob/main/routes/memberRouter.js#L165-L167)
> - [articles](https://velog.io/@qjatjs123123/%EA%B0%9C%EB%B0%9C-%EC%9D%BC%EC%A7%80-%EA%B2%8C%EC%8B%9C%ED%8C%90cookie-parser)
<br />

> ### SPA란?
> - SPA 정의
> - 리액트에서 SPA를 구현하는 방법
> - [articles](https://velog.io/@qjatjs123123/%EA%B0%9C%EB%B0%9C-%EC%9D%BC%EC%A7%80-%EA%B2%8C%EC%8B%9C%ED%8C%90SPA)
<br />

> ### 자동 로그아웃
> <img src="https://github.com/user-attachments/assets/d327e460-3e72-4d33-b5b5-fe2b326cd23e" width="550"/>
>
> - 사용자가 새로고침시 타이머가 초기화되는 오류 해결
> - [코드 바로보기](https://github.com/qjatjs123123/MyStory/blob/main/routes/boardRouter.js#L884-L899)
> - [articles](https://velog.io/@qjatjs123123/%EA%B0%9C%EB%B0%9C-%EC%9D%BC%EC%A7%80-%EA%B2%8C%EC%8B%9C%ED%8C%90%EC%9E%90%EB%8F%99-%EB%A1%9C%EA%B7%B8%EC%95%84%EC%9B%83-%ED%83%80%EC%9D%B4%EB%A8%B8)
<br />


> ### 페이징 속도 개선
> `No-offset` vs `Covering-index`
> - 기존 페이징처리에서 Offset이 커질수록 상당히 오랜 시간이 걸리는 문제 발생
> - 테이블에 접근하는 I/O없이 인덱스 접근만으로 성능을 향상시킬 수 있는 커버링 인덱스 도입
> <img width="550" alt="image" src="https://github.com/user-attachments/assets/5bfb8a12-1bd3-4cff-88a3-a9319458ed75" />
> <img width="550" alt="image (1)" src="https://github.com/user-attachments/assets/2966a831-11ef-4807-b14b-4982e11d3078" />
>
> - 데이터 변경이 없는 bbsID, userID, bbsAvailable를 토대로 커버링 인덱스 도입 => 데이터가 많은 BBS 테이블에서 복합인덱스 설정
> - 쿼리 속도 `20배` 향상
<br />

> ### React.Memo
> - BoardMain컴포넌트를 렌더링하게 되면 하위 컴포넌트들도 렌더링되는 문제 발생
> - 함수를 props로 넘길 때에는 `useCallback`을 객체를 props로 넘길 때 `useMemo`를 사용해보자

<br />

## 🤔 회고
React를 활용한 프론트엔드 SPA 개발과 Node.js를 이용한 Express API 서버 구축, 그리고 이를 실제로 배포까지 경험했던 프로젝트였습니다.  
이번 프로젝트를 통해 많은 것을 배울 수 있었지만, 동시에 몇 가지 아쉬움도 느꼈습니다.  

**첫째, props drilling 문제입니다.**  
컴포넌트 계층이 깊어질수록 props를 전달하는 과정이 복잡해지고, 유지보수가 어려워지는 동시에 불필요한 렌더링이 발생한다는 점을 체감했습니다.  
이를 해결하기 위해 Context API, Redux, Recoil 등 다양한 상태 관리 라이브러리를 활용할 수 있었지만, 프로젝트에서는 적용하지 못한 점이 아쉬움으로 남습니다.

**둘째, useEffect와 useState의 최소화 필요성입니다.**  
한 컴포넌트에서 상태를 관리할 때, 꼭 렌더링이 필요한 변수만 useState로 설정하고, 나머지는 일반 변수나 useRef를 활용해야 한다는 점을 배웠습니다.  
이를 통해 렌더링 효율을 높이고 성능을 최적화할 필요성을 느꼈습니다.

**셋째, useMemo와 useCallback의 활용입니다.**  
함수나 객체를 props로 전달할 때, 값이 변경되지 않아도 하위 컴포넌트가 재렌더링되는 문제가 있었습니다.  
이러한 상황에서 useMemo와 useCallback을 적절히 사용하면 불필요한 재렌더링을 방지하고 렌더링 성능을 향상시킬 수 있다고 느꼈습니다.  


## 📲 링크
| :: 시연                                                            |
| :------------------------------------------------------------------------------------- |
| :: [Youtube Link](https://youtu.be/TyQVO3QFEDo?si=9lLZNdxKwd-Ec96k) | 

| :: 개발일지                                                         |
| :------------------------------------------------------------------------------------- |
| :: [Blog Link](https://velog.io/@qjatjs123123/series/React-Node-%EA%B2%8C%EC%8B%9C%ED%8C%90) | 



