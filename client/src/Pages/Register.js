import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Register.css';
import Navbar from '../Components/Navbar.js';

const Register = () => {
  const [username, setUsername] = useState('');

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'https://note-taking-application-backend-k82k.onrender.com/register',
        {
          username,
          email,
          password,
        }
      );

      setError(response.data.message);

      setTimeout(() => {
        setError(null);
      }, 4000);
    } catch (error) {
      setError(
        error.response?.data.message || 'Registration failed. Please try again.'
      );

      setTimeout(() => {
        setError(null);
      }, 4000);
    }
  };

  return (
    <div className='container register-main-container'>
      <Navbar />
      <div className='d-flex justify-content-center align-items-center vh-100'>
        <div className='register-col col-lg-6 col-sm-10 col-12 rounded p-md-5 p-4 mx-auto form-box'>
          <h2 className='mb-4'>Register</h2>
          <form onSubmit={handleRegister}>
            <div className='mb-3'>
              <input
                autoFocus
                type='text'
                className='form-control custom-input'
                placeholder='Username'
                value={username}
                required
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className='mb-3'>
              <input
                type='email'
                className='form-control custom-input'
                placeholder='Email'
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className='mb-3'>
              <input
                type='password'
                className='form-control custom-input'
                placeholder='Password'
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type='submit' className='btn btn-outline-primary w-100'>
              Register
            </button>
            <p className='mt-3 text-center'>
              If you have an account,
              <Link to='/login' className='mx-2'>
                Login
              </Link>
            </p>
            {error && <p className='text-light text-center'>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
