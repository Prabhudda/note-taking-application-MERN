import React, { useContext } from 'react';
import { NoteContext } from '..//Context.js';
import { Link } from 'react-router-dom';

function Create() {
  const { handleInputChange, handleSubmit } = useContext(NoteContext);

  return (
    <div className='container my-5'>
      <div className='container pt-5'>
        <h2 className='pt-5'>Create Note</h2>
        <form onSubmit={handleSubmit}>
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
              <button type='submit' className='btn btn-primary'>
                Save Note
              </button>
            </div>
            <div className='mx-3'>
              <Link to='/' className='btn btn-success'>
                View Notes
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Create;
