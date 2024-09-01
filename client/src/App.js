import React, { useState } from 'react'
import Editor from './components/editor.js'
import NavBar from './components/NavBar.js';
import Footer from './components/Footer.js';
import CodeNav from './components/CodeNav.js'
import { Routes ,Route } from 'react-router-dom';
import AddCode from './components/addCode.js';

function App() {

  return (    
    <div className='app-container'>
      <NavBar/>
      <div className='main-container'>
        <Routes>
          <Route path='/new'element={<AddCode  />} />
          <Route path='/'element={<CodeNav  />} />
            <Route path='/editor/:id'
            element={<Editor />} />
        </Routes>
      </div>
      <Footer/>
    </div>
    
  )
}
export default App