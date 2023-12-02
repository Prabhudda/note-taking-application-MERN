import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { NoteContext } from '../Context'; // Fix the path to the Context.js file
import './Login.css';
import Navbar from '../Components/Navbar.js';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { Login, error } = useContext(NoteContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    Login(username, password);
  };

  return (
    <div className='container login-main-container'>
      <Navbar />
      <div className='d-flex justify-content-center align-items-center vh-100'>
        <div className='login-col col-lg-6 col-sm-10 col-12 rounded p-md-5 p-4 mx-auto form-box'>
          <h2 className='mb-4'>Login</h2>
          <form onSubmit={handleLogin} autoComplete='true'>
            <div className='mb-3'>
              <input
                autoFocus
                type='text'
                className='form-control custom-input'
                placeholder='Username'
                id='username'
                value={username}
                required
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className='mb-3'>
              <input
                type='password'
                className='form-control custom-input'
                placeholder='Password'
                id='password'
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type='submit' className='btn btn-outline-primary w-100'>
              Login
            </button>
            <p className='mt-3 text-center'>
              If you don't have an account,
              <Link to='/register' className='mx-2'>
                Register
              </Link>
            </p>
            {error && <p className='text-center text-light'>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
