import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { NoteContext } from '../Context.js';
import { BsPerson, BsTrash, BsPlus } from 'react-icons/bs';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import { AiOutlineLogout } from 'react-icons/ai';
import './Navbar.css';
function Navbar() {
  const {
    handleLogout,
    search,
    data,
    setSearch,
    deleteUserAccount,
    currentUser,
  } = useContext(NoteContext);
  const [display, setDisplay] = useState('none');

  const displayMenu = () => {
    let d = display === 'none' ? 'block' : 'none';
    setDisplay(d);
  };

  return (
    <div className='Navbar-main-container container-fluid fixed-top text-light d-flex justify-content-center align-items-center py-1'>
      <div className='container mt-0 py-2 d-flex justify-content-between align-items-center'>
        <div className='col-lg-3 d-flex justify-content-start align-items-center'>
          <h2 className='m-0'>
            <Link
              to='/'
              className='text-light'
              style={{ textDecoration: 'none' }}
            >
              Note.Hub
            </Link>
          </h2>
        </div>
        {currentUser && !data.length <= 0 && data.length > 1 && (
          <div className='col-lg-5 form-box navbar-input d-lg-flex d-none'>
            <input
              type='search'
              className='form-control custom-input '
              placeholder='Search Note'
              value={search}
              required
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}

        <div className='col-lg-3 d-flex justify-content-end align-items-center'>
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
          <div className='mx-2 position-relative d-flex justify-content-center align-items-center'>
            {currentUser ? (
              <div className=''>
                <div onClick={displayMenu}>
                  <Link
                    className='btn btn-outline-primary d-flex justify-content-between align-items-center'
                    style={{ textDecoration: 'none' }}
                  >
                    <BsPerson size={20} className='' />
                    <div className=' d-flex justify-content-center align-items-center'>
                      {display === 'none' ? (
                        <IoIosArrowDown />
                      ) : (
                        <IoIosArrowUp />
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
    </div>
  );
}

export default Navbar;
