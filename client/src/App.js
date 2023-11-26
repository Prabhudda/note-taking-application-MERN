import React, { useContext } from 'react';
import { useLocation, Routes, Route, Link } from 'react-router-dom';
import Home from './Pages/Home';
import Update from './Pages/Update';
import Create from './Pages/Create';
import Login from './Pages/Login';
import Register from './Pages/Register';
import { BsPlus } from 'react-icons/bs';
import { NoteContext } from './Context.js';

function App() {
  const location = useLocation();
  const { data, currentUser } = useContext(NoteContext);
  return (
    <div className='container'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/create' element={<Create />} />
        <Route path='/update/:id' element={<Update />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
      {location.pathname === '/' && currentUser && !data.length <= 0 && (
        <Link
          to='/create'
          className='d-md-none d-block plusToCreate d-flex justify-content-center align-items-center'
        >
          <BsPlus className='' size={25} />
        </Link>
      )}
    </div>
  );
}

export default App;
