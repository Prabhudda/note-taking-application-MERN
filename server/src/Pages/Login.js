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
    <div className='container mt-5'>
      <h2 className='mb-4'>Login</h2>
      <form onSubmit={handleLogin}>
        <div className='mb-3'>
          <label htmlFor='username' className='form-label'>
            Username:
          </label>
          <input
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
        <button type='submit' className='btn btn-primary'>
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
  );
};

export default Login;
