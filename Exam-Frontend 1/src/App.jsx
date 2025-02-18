import { useState } from 'react'
import './App.css'
import Email from './components/Email'
import { Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Otp from './components/Otp'

function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Email />} />
      <Route path='/home' element={<Home/>}/>
      <Route path='/otp' element={<Otp/>}/>
    </Routes>
      
    </>
  )
}

export default App
