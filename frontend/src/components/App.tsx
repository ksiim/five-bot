import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {request} from '../api/request.ts';
import {useEffect, useState} from 'react';
import FiveBot from '../pages/Clicker/FiveBot.tsx';
import Friends from '../pages/Friends/Friends.tsx';
import Airdrop from '../pages/Airdrop/Airdrop.tsx';
import Rating from '../pages/Rating/Rating.tsx';

function App() {
  const [user, setUser] = useState({
    id: 0,
    username: 'Unknown',
    energy: 0,
    balance: 0
  })
  
  useEffect(() => {
    async function fetchData(){
      const response = await request('user')
      setUser(response)
    }
    fetchData();
  }, [])
  
  return (
    <Router>
      <Routes>
        <Route path='/' element={<FiveBot data={user}/>}/>
        <Route path='/friends' element={<Friends/>}/>
        <Route path='/airdrop' element={<Airdrop/>}/>
        <Route path='/rating' element={<Rating/>}/>
      </Routes>
    </Router>
  )
}

export default App
