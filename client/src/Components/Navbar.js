import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { NoteContext } from '../Context.js';
import { BsPerson, BsTrash, BsPlus } from 'react-icons/bs';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import { AiOutlineLogout } from 'react-icons/ai';
function Navbar() {
  const { handleLogout, deleteUserAccount, currentUser } =
    useContext(NoteContext);

  const [display, setDisplay] = useState('none');

  const displayMenu = () => {
    let d = display === 'none' ? 'block' : 'none';
    setDisplay(d);
  };

  return (
    <div className='container position-relative'>
      <div className='mt-5  d-flex justify-content-between align-items-center'>
        <div className='d-flex justify-content-center align-items-center'>
          <h2 className='m-0'>Note.Hub</h2>
        </div>

        <div className='d-flex'>
          {currentUser && (
            <div className='d-md-block d-none'>
              <Link
                to='/create'
                className='btn btn-outline-primary d-flex justify-content-center align-items-center'
              >
                Create Note
                <BsPlus size={20} />
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
              <div className=''>
                <div onClick={displayMenu}>
                  <Link
                    className='btn btn-outline-primary d-flex justify-content-between align-items-center'
                    style={{ textDecoration: 'none' }}
                  >
                    <BsPerson size={20} className='' />
                    <div className='mx-1'>
                      <p className='m-0'>
                        {currentUser
                          .toString()
                          .split(' ')[0]
                          .charAt(0)
                          .toUpperCase() +
                          currentUser.toString().split(' ')[0].slice(1)}
                      </p>
                    </div>
                    <div className=' d-flex justify-content-center align-items-center'>
                      {display === 'none' ? (
                        <IoIosArrowUp />
                      ) : (
                        <IoIosArrowDown />
                      )}
                    </div>
                  </Link>
                </div>
                <div
                  className='dropdown position-absolute p-2'
                  style={{ display: `${display}` }}
                >
                  <div className=''>
                    <div
                      className='mt-2 w-100 py-1 px-2 d-flex justify-content-center align-items-center rounded'
                      style={{
                        fontSize: '13px',
                        border: '1px solid #007bff',
                        color: '#007bff',
                      }}
                    >
                      <BsPerson
                        size={20}
                        className=''
                        style={{ marginRight: '5px' }}
                      />
                      {currentUser
                        .toString()
                        .split(' ')
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(' ')}
                    </div>
                  </div>
                  <Link
                    to='/login'
                    onClick={handleLogout}
                    className='mt-2 w-100 btn btn-outline-danger py-0 py-1 d-flex justify-content-center align-items-center'
                    style={{ fontSize: '12px' }}
                  >
                    <AiOutlineLogout size={16} className='mx-1' /> Sign Out
                  </Link>

                  <button
                    onClick={deleteUserAccount}
                    className='w-100 btn btn-outline-danger py-0 mt-2 py-1 d-flex justify-content-center align-items-center'
                    style={{ fontSize: '12px' }}
                  >
                    <BsTrash className='mx-1' /> Delete Account
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
      <hr></hr>
    </div>
  );
}

export default Navbar;
