import React, { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NoteContext } from '..//Context.js';
import axios from 'axios';

function Update() {
  const { handleInputChange, note, data, setNote } = useContext(NoteContext);
  const location = useLocation();
  const ID = location.pathname.split('/')[2].trim();
  const navigation = useNavigate();

  const noteData = data.find((item) => item.id === parseInt(ID));

  useEffect(() => {
    if (noteData) {
      setNote({
        ...note,
        title: noteData.title || '',
        description: noteData.description || '',
      });
    }
  }, [noteData, setNote]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await axios.put(
      `https://note-taking-application-backend-k82k.onrender.com/update/${ID}`,
      note
    );
    // console.log(res);
    navigation('/');
  };

  return (
    <div className='container'>
      <div
        className='d-flex justify-content-center align-items-center'
        style={{ height: '100vh', width: '100%' }}
      >
        <div className='w-md-50 w-100'>
          <h2>Update Note</h2>
          <form onSubmit={handleUpdate}>
            <div className='mb-3'>
              <label htmlFor='title' className='form-label'>
                Title
              </label>
              <input
                type='text'
                className='form-control'
                id='title'
                name='title'
                value={(note && note.title) || ''}
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
                value={(note && note.description) || ''}
                rows='4'
                required
              ></textarea>
            </div>
            <button type='submit' className='btn btn-outline-primary'>
              Save Note
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Update;
