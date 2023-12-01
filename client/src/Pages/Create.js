import React, { useContext } from 'react';
import { NoteContext } from '..//Context.js';
import { Link } from 'react-router-dom';
import Navbar from '../Components/Navbar.js';
import './Create.css';
function Create() {
  const { handleInputChange, handleSubmit } = useContext(NoteContext);

  return (
    <div className='container create-main-container'>
      <Navbar />
      <div className='d-flex justify-content-center align-items-center vh-100'>
        <div className='create-note-col col-lg-6 col-sm-10 col-12 rounded p-md-5 p-4 mx-auto form-box mt-5'>
          <h2 className='mb-3'>Create Note</h2>
          <form onSubmit={handleSubmit}>
            <div className='mb-3'>
              <label htmlFor='title' className='form-label'>
                Title
              </label>
              <input
                autoFocus
                type='text'
                className='form-control custom-input'
                id='title'
                name='title'
                placeholder='Enter your title...'
                onChange={handleInputChange}
                required
              />
            </div>
            <div className='mb-3'>
              <label htmlFor='description' className='form-label'>
                Description
              </label>
              <textarea
                className='form-control custom-input'
                id='description'
                name='description'
                placeholder='Enter your text...'
                onChange={handleInputChange}
                rows={5}
                required
                style={{ resize: 'none' }}
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
