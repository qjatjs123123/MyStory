import React, {Component} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './components/Main';
import FindId from './components/FindId';
import FindPw from './components/FindPw';
import Header from './components/Nav';
import Join from './components/Join';
import ChangePw from './components/ChangePw';
import Board from './components/Board';
class Routing extends Component{
    constructor(props){
        super(props);
            this.state = {
                count : 1
            };
    }

    setlogin = () => {
        this.setState({count:this.state.count+1});
        console.log(this.state.count);
    }

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
                </Routes>
            </BrowserRouter>
        )
    }
}

export default Routing;