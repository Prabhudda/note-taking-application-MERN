import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Update from './Pages/Update';
import Create from './Pages/Create';
import Login from './Pages/Login';
import Register from './Pages/Register';
function App() {
  return (
    <div className='container'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/create' element={<Create />} />
        <Route path='/update/:id' element={<Update />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
