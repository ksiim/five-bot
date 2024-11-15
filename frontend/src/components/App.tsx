import FiveBot from './FiveBot.tsx';
import {TG, request} from '../api/request.ts';
import {useEffect, useState} from 'react';

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
    <>
      <FiveBot data={user} setUser={setUser}/>
    </>
  )
}

export default App
