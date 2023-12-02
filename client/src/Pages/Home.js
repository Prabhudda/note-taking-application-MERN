import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { NoteContext } from '../Context.js';
import { FaTrash, FaEdit } from 'react-icons/fa'; // Example with Font Awesome icons
import Navbar from '../Components/Navbar.js';
import './Home.css';
import moment from 'moment';

function Home() {
  const { data, getData, currentUser, onDelete, userId, search, setSearch } =
    useContext(NoteContext);
  // const [text, setText] = useState(false);
  const [expandedNotes, setExpandedNotes] = useState([]);
  const [filteredNote, setFiltredNote] = useState(data);

  const filterNote = () => {
    setFiltredNote(
      data.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      )
    );
  };

  useEffect(() => {
    filterNote();
  }, [search, data]);

  useEffect(() => {
    const fetchData = async () => {
      if (userId !== null) {
        await getData();
      }
    };

    fetchData();
  }, [userId, currentUser, getData]);

  return (
    <div>
      <Navbar />
      <div className='position-relative Home-main-container'>
        {currentUser && !data.length <= 0 && (
          <div>
            <div className='form-box container navbar-input d-lg-none d-block'>
              <input
                type='search'
                className='form-control custom-input'
                placeholder='search note'
                value={search}
                required
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <h4 className='text-center mt-3'>Quick Notes</h4>
            {filteredNote.length > 0 ? (
              <h4 className='text-center mt-3'>Quick Notes</h4>
            ) : (
              <p className='text-center mt-3'>
                No notes found. Start creating now!
              </p>
            )}
          </div>
        )}
        <div className='container position-relative'>
          <div className='row my-1 justify-content-center'>
            {!data.length <= 0 &&
              currentUser &&
              filteredNote.map((item) => (
                <div className='col-lg-4 col-md-5 mt-3' key={item.id}>
                  <div className='note-box d-flex justify-content-between flex-column  p-3 m-2 flex-fill rounded'>
                    <div>
                      <div className='note-title'>
                        <h6 className=''>{item.title.toUpperCase()}</h6>
                        <hr></hr>
                      </div>
                      <p
                        className='description lead'
                        style={{
                          width: '100%',
                        }}
                      >
                        {expandedNotes.includes(item.id)
                          ? `${item.description}`
                          : `${item.description.slice(0, 90)}`}
                        {item.description.length > 150 && (
                          <span
                            className='read-more mx-1'
                            onClick={() => {
                              setExpandedNotes((prev) =>
                                prev.includes(item.id)
                                  ? prev.filter((id) => id !== item.id)
                                  : [...prev, item.id]
                              );
                            }}
                            style={{ color: 'blue', cursor: 'pointer' }}
                          >
                            {expandedNotes.includes(item.id)
                              ? ' read less'
                              : ' read more'}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className=' d-flex justify-content-between align-items-center'>
                      <p
                        className='m-0 '
                        style={{ fontSize: '15px', opacity: '50%' }}
                      >
                        {moment(item.createdDate).format('D/MM/YYYY')}
                      </p>
                      <div className='d-flex'>
                        <div className=' text-center mx-1' title='Edit'>
                          <Link
                            to={`/update/${item.id}`}
                            className='w-100 btn btn-outline-success px-2 py-1'
                          >
                            <FaEdit className='' />
                          </Link>
                        </div>
                        <div className='mx-1' title='Delete'>
                          <button
                            className='btn btn-outline-danger px-2 py-1'
                            onClick={() => onDelete(item.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        {!currentUser && (
          <div className='text-center home-text'>
            <h2 className='text-center'>Your Digital Notepad</h2>
            <p className='lead mt-3'>
              Unleash your creativity, stay organized, and never miss a
              brilliant idea. Your notes, with Note.Hub
            </p>
            <p className='lead'>Start your journey with Note.Hub</p>
          </div>
        )}
        {data.length <= 0 && currentUser && (
          <div className='text-center home-text'>
            <div>
              <h2 className='text-center'>
                Welcome,{' '}
                {currentUser
                  .toString()
                  .split(' ')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
                !
              </h2>
              <p className='lead mt-3'>
                It looks like you haven't created any notes yet. Start capturing
                your thoughts and ideas!
              </p>
              <p className='lead'>
                Click the "Create Note" button to get started.
              </p>
            </div>
            <div className=''>
              <Link to='/create' className='btn btn-outline-success'>
                Create Note
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
