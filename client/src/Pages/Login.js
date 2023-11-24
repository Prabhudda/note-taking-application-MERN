import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { NoteContext } from '..//Context.js';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { Login, error } = useContext(NoteContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    Login(username, password);
  };

  return (
    <div className='container'>
      <div
        className='d-flex justify-content-center align-items-center'
        style={{ height: '100vh', width: '100%' }}
      >
        <div className='form-box'>
          <h2 className='mb-5'>Login</h2>
          <form onSubmit={handleLogin} autoComplete='true'>
            <div className='mb-3'>
              <label htmlFor='username' className='form-label'>
                Username:
              </label>
              <input
                autoFocus
                type='text'
                className='form-control'
                id='username'
                value={username}
                required
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className='mb-3'>
              <label htmlFor='password' className='form-label'>
                Password:
              </label>
              <input
                type='password'
                className='form-control'
                id='password'
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type='submit' className='btn btn-outline-primary'>
              Login
            </button>
            <p className='mt-3'>
              if you don't have an account,
              <span className='mx-2'>
                <Link to='/register' className=''>
                  Register
                </Link>
              </span>
            </p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
