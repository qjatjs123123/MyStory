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
    render(){
        return(
            <BrowserRouter>
                <Header/>
                <Routes>
                    <Route path='/' element={<Main />} />  
                    <Route path='/join' element={<Join />} /> 
                    <Route path='/main' element={<Main />} />
                    <Route path='/FindId' element={<FindId />} />
                    <Route path='/FindPw' element={<FindPw />} />
                    <Route path='/ChangePw' element={<ChangePw />} />
                    <Route path='/Board' element={<Board />} />
                </Routes>
            </BrowserRouter>
        )
    }
}

export default Routing;