import React, { useEffect } from 'react'
import {Route,Routes} from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import { useState } from 'react'
import Interview from './pages/Interview.jsx'
import InterviewPage from './pages/InterviewPage.jsx'
import Feedback from "./pages/Feedback.jsx";
import History from './pages/History.jsx'
import Settings from './pages/Settings.jsx'
import DsaSetupPage from "./pages/DsaSetupPage";
import DsaInterviewPage from "./pages/DsaInterviewPage";
function App() {
  const serverurl = "http://localhost:8000";
  const [user, setuser] = useState(null);

useEffect(() => {
  const getUser = async () => {
    try {
      const res = await fetch(serverurl + "/api/auth/me", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        setuser(data.user);
      }
    } catch (error) {
      console.log(error);
    }
  };
  getUser();
}, []);
  return (
      <Routes>
        <Route path='Interview' element={<Interview user={user} setuser={setuser}/>}/>
        <Route path='/' element={<Home user ={user} setuser = {setuser} />}/>
        <Route path='/Auth' element={<Auth setuser= {setuser}/>}/>
        <Route path="/interview/:sessionid" element={<InterviewPage/>}/>
        <Route path="/feedback/:sessionid"element={<Feedback />}/>
        <Route path="/history" element={<History />}/>
        <Route  path="/settings" element={<Settings/>}  />
          <Route path="/dsa/setup" element={<DsaSetupPage />} />
           <Route
    path="/dsa/interview/:sessionId"
    element={<DsaInterviewPage />}
  />
        </Routes>
        
  )
}

export default App