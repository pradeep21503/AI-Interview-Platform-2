import React from 'react'
import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import { useState } from 'react';

function Home({user,setuser}) {
   const [showAuthModal, setShowAuthModal] = useState(false);
  return (
   
    <>
      <Navbar user={user} setuser={setuser}  showAuthModal={showAuthModal} setShowAuthModal={setShowAuthModal} />
      <Hero user={user}  showAuthModal={showAuthModal} setShowAuthModal={setShowAuthModal}/>
  
    </>

  )
}

export default Home