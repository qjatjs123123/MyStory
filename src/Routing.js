import React, {Component} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './components/Main';
import FindId from './components/FindId';
import FindPw from './components/FindPw';
import Header from './components/Nav';
import Join from './components/Join';
import ChangePw from './components/ChangePw';
import Board from './components/Board';
import BoardWrite from './components/BoardWrite';
import BoardRead from './components/BoardRead';
import BoardUpdate from './components/BoardUpdate';


class Routing extends Component{
    constructor(props){
        super(props);
            this.state = {
                count : 1,
                bbsID : 0,
                bbsTitle: 0,
                bbsContent:0
            };
    }

    setlogin = () => {
        this.setState({count:this.state.count+1});
    }
    setbbsID = (param) => {this.setState({bbsID: param})}
    setbbsTitle = (param) => {this.setState({bbsTitle: param})}
    setbbsContent = (param) => {this.setState({bbsContent: param})}

    render(){
        return(
            <BrowserRouter>
                <Header count={this.state.count}/>
                <Routes>
                    <Route path='/' element={<Main setlogin={this.setlogin}/>} />  
                    <Route path='/join' element={<Join />} /> 
                    <Route path='/main' element={<Main setlogin={this.setlogin}/>} />
                    <Route path='/FindId' element={<FindId />} />
                    <Route path='/FindPw' element={<FindPw />} />
                    <Route path='/ChangePw' element={<ChangePw />} />
                    <Route path='/Board' element={ <Board />} />
                    <Route path='/BoardWrite' element={ <BoardWrite update={false} bbsID={''} bbsTitle={''} bbsContent={''}/>} />
                    <Route path='/BoardRead' element={ <BoardRead setbbsID={this.setbbsID} setbbsTitle={this.setbbsTitle} setbbsContent={this.setbbsContent}/>} />
                    <Route  path='/BoardWrite/Update' element={ <BoardWrite update={true} bbsID={this.state.bbsID} bbsTitle={this.state.bbsTitle} bbsContent={this.state.bbsContent}/> } />
                </Routes>
            </BrowserRouter>
        )
    }
}

export default Routing;