import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NoteContext } from '../Context.js';

function Home() {
  const { data, getData, handleLogout, currentUser, onDelete, userId } =
    useContext(NoteContext);

  useEffect(() => {
    const fetchData = async () => {
      if (userId !== null) {
        await getData();
      }
    };

    fetchData();
  }, [userId, currentUser, getData]);

  return (
    <div className='container'>
      <div className='mt-5  d-flex justify-content-between align-items-center'>
        <div className=''>
          <h2 className=''>Notes</h2>
        </div>
        <div className='d-flex'>
          {currentUser && (
            <div className='mx-2'>
              <Link to='/create' className='btn btn-outline-primary'>
                Create Note
              </Link>
            </div>
          )}

          <div className='mx-2'>
            {currentUser === null ? (
              <Link to='/login' className='btn btn-outline-success'>
                Login
              </Link>
            ) : (
              <Link
                to='/login'
                onClick={handleLogout}
                className='btn btn-outline-primary'
              >
                Logout
              </Link>
            )}
          </div>
          <div className='mx-2 '>
            {currentUser ? (
              <Link to='/' className='btn btn-outline-primary '>
                {currentUser}
              </Link>
            ) : (
              <Link
                to='/register '
                className='btn btn-outline-primary rounded-pill'
              >
                Register
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className='row my-5 justify-content-center'>
        {data.length <= 0 ? (
          <h6 className='text-center'>
            Please login to create new note, Your notes are not found...
          </h6>
        ) : (
          data.map((item) => (
            <div
              className='col-lg-5 d-flex justify-content-between align-items-start'
              key={item.id}
            >
              <div className='border p-3 m-1 flex-fill '>
                <h5>{item.title.toUpperCase()}</h5>
                <p>{item.description.toUpperCase()}</p>
                <div className='row '>
                  <div className='col-6'>
                    <button
                      className='w-100 btn btn-outline-danger'
                      onClick={() => onDelete(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                  <div className='col-6'>
                    <Link
                      to={`/update/${item.id}`}
                      className='w-100 btn btn-outline-success'
                    >
                      Update
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
