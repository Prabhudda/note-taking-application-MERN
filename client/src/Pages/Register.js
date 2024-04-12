// import axios from 'axios';
// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import './Register.css';
// import Navbar from '../Components/Navbar.js';

// const Register = () => {
//   const [username, setUsername] = useState('');

//   const [email, setEmail] = useState('');

//   const [password, setPassword] = useState('');

//   const [error, setError] = useState(null);

//   const [loading, setLoading] = useState();

//   const handleRegister = async (e) => {

//     e.preventDefault();
//     if (!username || !password || !email) {
//       setError('Please fill out all fields correctly.');
//       return;
//     }

//     if (password.length < 6) {
//       setError('Password must be at least 6 characters long.');
//       return;
//     }

//     try {
//       const response = await axios.post(
//         'https://note-taking-application-mern.onrender.com/api/auth/register',
//         {
//           username,
//           email,
//           password,
//         }
//       );

//       setLoading(response.data.loading);
//       setError(response.data.message);

//       setUsername('');
//       setEmail('');
//       setPassword('');

//       setTimeout(() => {
//         setError(null);
//       }, 4000);
//     } catch (error) {
//       setError(
//         error.response?.data.message || 'Registration failed. Please try again.'
//       );

//       setTimeout(() => {
//         setError(null);
//       }, 4000);
//     }
//   };

//   return (
//     <div className='container register-main-container'>
//       <Navbar />
//       <div className='d-flex justify-content-center align-items-center vh-100'>
//         <div className='register-col col-lg-6 col-sm-10 col-12 rounded p-md-5 p-4 mx-auto form-box'>
//           <h2 className='mb-4'>Register</h2>
//           <form onSubmit={handleRegister}>
//             <div className='mb-3'>
//               <input
//                 autoFocus
//                 type='text'
//                 className='form-control custom-input'
//                 placeholder='Username'
//                 value={username}
//                 required
//                 onChange={(e) => setUsername(e.target.value)}
//               />
//             </div>
//             <div className='mb-3'>
//               <input
//                 type='email'
//                 className='form-control custom-input'
//                 placeholder='Email'
//                 value={email}
//                 required
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>
//             <div className='mb-3'>
//               <input
//                 type='password'
//                 className='form-control custom-input'
//                 placeholder='Password'
//                 value={password}
//                 required
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>
//             <button
//               type='submit'
//               onClick={() => setLoading(true)}
//               className='btn btn-outline-primary w-100'
//             >
//               {loading ? 'Loading...' : 'Register'}
//             </button>
//             <p className='mt-3 text-center'>
//               If you have an account,
//               <Link to='/api/auth/login' className='mx-2'>
//                 Login
//               </Link>
//             </p>
//             {error && <p className='text-primary text-center'>{error}</p>}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;
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
  const [loading, setLoading] = useState(false); // Initialize loading as false

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !password || !email) {
      setError('Please fill out all fields correctly.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true); // Set loading to true only when the form is valid and request is sent

    try {
      const response = await axios.post(
        'https://note-taking-application-mern.onrender.com/api/auth/register',
        {
          username,
          email,
          password,
        }
      );

      setError(response.data.message);

      setUsername('');
      setEmail('');
      setPassword('');

      setTimeout(() => {
        setError(null);
      }, 5000); // Set timeout to remove error message after 5 seconds
    } catch (error) {
      setError(
        error.response?.data.message || 'Registration failed. Please try again.'
      );

      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setLoading(false); // Reset loading state after request completion
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
            <button
              type='submit'
              className='btn btn-outline-primary w-100'
              disabled={loading} // Disable button when loading is true
            >
              {loading ? 'Loading...' : 'Register'}
            </button>
            <p className='mt-3 text-center'>
              If you have an account,
              <Link to='/api/auth/login' className='mx-2'>
                Login
              </Link>
            </p>
            {error && <p className='text-primary text-center'>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
