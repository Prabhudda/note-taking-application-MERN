import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  // const navigate = useNavigate();

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
    } catch (error) {
      console.error('Registration failed:', error.message);

      setError(
        error.response?.data.message || 'Registration failed. Please try again.'
      );
    }

    // try {
    //   const response = await axios.post('http://localhost:8080/register', {
    //     username,
    //     email,
    //     password,
    //   });

    //   setError(response.data.message);
    // } catch (error) {
    //   console.error('Registration failed:', error.message);

    //   setError(
    //     error.response?.data.message || 'Registration failed. Please try again.'
    //   );
    // }
  };

  return (
    <div className='container'>
      <div
        className='d-flex justify-content-center align-items-center'
        style={{ height: '100vh', width: '100%' }}
      >
        <div className='form-box'>
          <h2 className='mb-3'>Register</h2>
          <form onSubmit={handleRegister}>
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
              <label htmlFor='email' className='form-label'>
                Email:
              </label>
              <input
                type='email'
                className='form-control'
                id='email'
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
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
              Register
            </button>
            <p className='mt-3'>
              if you have an account,
              <span className='mx-2'>
                <Link to='/login' className=''>
                  Login
                </Link>
              </span>
            </p>
            {error && <p className='text-success'>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
