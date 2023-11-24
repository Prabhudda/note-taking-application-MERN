import React, { useContext } from 'react';
import { NoteContext } from '..//Context.js';
import { Link } from 'react-router-dom';

function Create() {
  const { handleInputChange, handleSubmit } = useContext(NoteContext);

  return (
    <div className='container'>
      <div
        className='d-flex justify-content-center align-items-center'
        style={{ height: '100vh', width: '100%' }}
      >
        <div className='form-box'>
          <h2 className='pt-5 mb-5'>Create Note</h2>
          <form onSubmit={handleSubmit} className=''>
            <div className='mb-3'>
              <label htmlFor='title' className='form-label'>
                Title
              </label>
              <input
                type='text'
                className='form-control'
                id='title'
                name='title'
                onChange={handleInputChange}
                required
              />
            </div>
            <div className='mb-3'>
              <label htmlFor='description' className='form-label'>
                Description
              </label>
              <textarea
                className='form-control'
                id='description'
                name='description'
                onChange={handleInputChange}
                rows='4'
                required
              ></textarea>
            </div>
            <div className='d-flex'>
              <div>
                <button type='submit' className='btn btn-outline-primary'>
                  Save Note
                </button>
              </div>
              <div className='mx-3'>
                <Link to='/' className='btn btn-outline-success'>
                  View Notes
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Create;
