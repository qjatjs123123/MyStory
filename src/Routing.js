import React, {Component} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './components/pages/memberPage/Main';
import FindId from './components/pages/memberPage/FindId';
import FindPw from './components/pages/memberPage/FindPw';
import Header from './components/nav/header';
import Join from './components/pages/memberPage/Join';
import ChangePw from './components/pages/memberPage/ChangePw';
import BoardWrite from './components/pages/boardwritePage/BoardWrite';
import BoardRead from './components/pages/boardreadPage/BoardRead';
import BoardMain from './components/pages/boardmainPage/BoardMain';
import ProfileMain from './components/pages/ProfilePage/ProfileMain'
import HomePage from './components/pages/homePage/HomePage';
import HashtagPage from './components/pages/hashtagPage/HashtagPage';
import MyPage from './components/pages/MyPage/MyPage';
class Routing extends Component{
    constructor(props){
        super(props);
            this.state = {
                count : 1,
                bbsID : 0,
                bbsTitle: 0,
                bbsContent:0,
                userID:''
            };
    }
    
    setlogin = (userID) => {
        this.setState({count:this.state.count+1});
        this.setState({userID:userID});
    }
    setbbsID = (param) => {this.setState({bbsID: param})}
    setbbsTitle = (param) => {this.setState({bbsTitle: param})}
    setbbsContent = (param) => {this.setState({bbsContent: param})}
    setcount = () => {this.setState({count:this.state.count+1});}
    render(){
        return(
            <BrowserRouter>
                <Header userID={this.state.userID} count={this.state.count}/>
                <Routes>
                    <Route path='/' element={<Main setlogin={this.setlogin}/>} />  
                    <Route path='/join' element={<Join mypage={false}/>} /> 
                    <Route path='/main' element={<Main setlogin={this.setlogin}/>} />
                    <Route path='/FindId' element={<FindId />} />
                    <Route path='/FindPw' element={<FindPw />} />
                    <Route path='/ChangePw' element={<ChangePw />} />
                    <Route path='/Board' element={ <BoardMain />} />
                    <Route path='/Profile/:userID' element={ <HomePage/>} />      
                    <Route path='/mypage' element={ <MyPage userID={this.state.userID} setcount={this.setcount}/>} />             
                    <Route path='/tags/:hashTag' element={ <HashtagPage/>} />
                    <Route path='/Profile' element={ <ProfileMain ishome={false} curtab={"clock"} tabData={["clock", "board"]}/>} />
                    <Route path='/BoardWrite' element={ <BoardWrite update={false} bbsID={''} bbsTitle={''} bbsContent={''}/>} />
                    <Route path='/BoardRead' element={ <BoardRead setbbsID={this.setbbsID} setbbsTitle={this.setbbsTitle} setbbsContent={this.setbbsContent}/>} />
                    <Route  path='/BoardWrite/Update/:bbsWriteID' element={ <BoardWrite update={true} bbsID={this.state.bbsID} bbsTitle={this.state.bbsTitle} bbsContent={this.state.bbsContent}/> } />
                </Routes>
            </BrowserRouter>
        )
    }
}

export default Routing;