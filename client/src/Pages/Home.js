import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { NoteContext } from '../Context.js';
import { FaTrash, FaEdit } from 'react-icons/fa'; // Example with Font Awesome icons

function Home() {
  const {
    data,
    getData,
    handleLogout,
    deleteUserAccount,
    currentUser,
    onDelete,
    userId,
  } = useContext(NoteContext);

  useEffect(() => {
    const fetchData = async () => {
      if (userId !== null) {
        await getData();
      }
    };

    fetchData();
  }, [userId, currentUser, getData]);

  const [display, setDisplay] = useState('none');

  const displayMenu = () => {
    let d = display === 'none' ? 'block' : 'none';
    setDisplay(d);
  };

  return (
    <div className=''>
      <div className='container position-relative'>
        <div className='mt-5  d-flex justify-content-between align-items-center'>
          <div className=''>
            <h2 className=''>NoteHub</h2>
          </div>

          <div className='d-flex'>
            {currentUser && (
              <div className=''>
                <Link to='/create' className='btn btn-outline-primary'>
                  Create Note
                </Link>
              </div>
            )}

            <div className=''>
              {currentUser === null ? (
                <Link to='/login' className='btn btn-outline-success'>
                  Login
                </Link>
              ) : (
                ''
              )}
            </div>
            <div className='mx-2 d-flex justify-content-center align-items-center'>
              {currentUser ? (
                <div
                  title='profile'
                  className='profile-picture'
                  onClick={displayMenu}
                >
                  <Link className='' style={{ textDecoration: 'none' }}>
                    {currentUser.charAt(0).toUpperCase()}
                  </Link>
                  <div
                    className='dropdown position-absolute p-2'
                    style={{ display: `${display}` }}
                  >
                    <Link
                      to='/login'
                      onClick={handleLogout}
                      className='w-100 btn btn-outline-danger py-0 py-1'
                      style={{ fontSize: '13px' }}
                    >
                      Logout
                    </Link>

                    <button
                      onClick={deleteUserAccount}
                      className='w-100 btn btn-outline-danger py-0 mt-2 py-1'
                      style={{ fontSize: '13px' }}
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to='/register '
                  className='btn btn-outline-primary rounded-pill '
                >
                  Register
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className='row my-5 justify-content-center'>
          {data.length <= 0 ? (
            <div className='text-center home-text'>
              <h2 className='text-center'>Welcome, {currentUser}!</h2>
              <p className='lead mt-3'>
                It looks like you haven't created any notes yet. Start capturing
                your thoughts and ideas!
              </p>
              <p className='lead'>
                Click the "Create Note" button to get started.
              </p>
            </div>
          ) : (
            data.map((item) => (
              <div
                className='col-lg-5 d-flex justify-content-between align-items-start'
                key={item.id}
              >
                <div className='border p-3 m-1 flex-fill rounded'>
                  <div>
                    <h6 className='text-dark'>{item.title.toUpperCase()}</h6>
                    <hr></hr>
                    <p className='description lead'>{item.description}</p>
                  </div>
                  <div className=' d-flex justify-content-between'>
                    <div className='' title='Delete'>
                      <button
                        className='w-100 btn btn-outline-danger px-2 py-1'
                        onClick={() => onDelete(item.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                    <div className=' text-center' title='Edit'>
                      <Link
                        to={`/update/${item.id}`}
                        className='w-100 btn btn-outline-success px-2 py-1'
                      >
                        <FaEdit className='' />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {!currentUser && (
        <div className='text-center home-text'>
          <h2 className='text-center'>Your Digital Notepad</h2>
          <p className='lead mt-3'>
            Unleash your creativity, stay organized, and never miss a brilliant
            idea. Your notes, with NoteHub
          </p>
          <p className='lead'>Start your journey with NoteHub</p>
        </div>
      )}
    </div>
  );
}

export default Home;
