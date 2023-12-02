import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export const NoteContext = createContext();

function NoteProvider({ children }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [note, setNote] = useState(null);

  const [userId, setUserId] = useState(
    JSON.parse(localStorage.getItem('userId') || null)
  );
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('username') || null)
  );

  const navigate = useNavigate();

  const getData = async () => {
    try {
      const response = await axios.get(
        'https://note-taking-application-backend-k82k.onrender.com',
        {
          headers: {
            authorization: userId,
          },
        }
      );
      setData(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }

    // try {
    //   const response = await axios.get('http://localhost:8080', {
    //     headers: {
    //       authorization: userId,
    //     },
    //   });
    //   setData(response.data.data);
    //   setIsLoading(false);
    // } catch (error) {
    //   console.error('Error fetching data:', error);
    //   setIsLoading(false);
    // }
  };
  useEffect(() => {
    const fetchData = async () => {
      if (userId !== null) {
        await getData();
      }
    };

    fetchData();
  }, [userId, setData]);

  const onDelete = async (id) => {
    try {
      await axios.delete(
        `https://note-taking-application-backend-k82k.onrender.com/delete/${id}`
      );
      setData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting data:', error);
    }

    // try {
    //   await axios.delete(`http://localhost:8080/delete/${id}`);
    //   setData((prevData) => prevData.filter((item) => item.id !== id));
    // } catch (error) {
    //   console.error('Error deleting data:', error);
    // }
  };
  const deleteUserAccount = async () => {
    try {
      await axios.delete(
        `https://note-taking-application-backend-k82k.onrender.com/delete/account/${userId}`
      );
      Cookies.remove('token');
      localStorage.removeItem('username');
      localStorage.removeItem('userId');
      setCurrentUser(null);
      navigate('/register');
    } catch (err) {
      console.log(err);
    }

    // try {
    //   await axios.delete(`http://localhost:8080/delete/account/${userId}`);
    //   Cookies.remove('token');
    //   localStorage.removeItem('username');
    //   localStorage.removeItem('userId');
    //   setCurrentUser(null);
    //   navigate('/register');
    // } catch (err) {
    //   console.log(err);
    // }
  };

  const handleInputChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value, userId });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://note-taking-application-backend-k82k.onrender.com/create',
        note
      );
      console.log(response.data);
      setNote({ id: null, title: '', description: '', userId: userId });
      await getData();
      navigate('/');
    } catch (error) {
      console.error('Error creating note:', error);
    }

    // try {
    //   const response = await axios.post('http://localhost:8080/create', note);
    //   console.log(response.data);
    //   setNote({ id: null, title: '', description: '', userId: userId });
    //   await getData();
    //   navigate('/');
    // } catch (error) {
    //   console.error('Error creating note:', error);
    // }
  };

  const [error, setError] = useState('');

  const Login = async (email, password) => {
    try {
      const response = await axios.post(
        'https://note-taking-application-backend-k82k.onrender.com/login',
        {
          email,
          password,
        }
      );
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setError('');

        console.log('Logged in successfully:', response.data);
        setCurrentUser(response.data.user.username);
        // setUserEmail(response.data.user.email);
        setUserId(response.data.user.id);

        Cookies.set('token', response.data.token, {
          expires: 1,
        });
        localStorage.setItem(
          'username',
          JSON.stringify(response.data.user.username)
        );
        localStorage.setItem('userId', JSON.stringify(response.data.user.id));

        await getData();

        navigate('/');
      }
    } catch (error) {
      setError('Please enter the valid credentials again.');
    }

    // try {
    //   const response = await axios.post('http://localhost:8080/login', {
    //     username,
    //     password,
    //   });
    //   if (response.data.error) {
    //     setError(response.data.error);

    //     setTimeout(() => {
    //       setError(null);
    //     }, 4000);
    //   } else {
    //     setError('');

    //     console.log('Logged in successfully:', response.data);
    //     setCurrentUser(response.data.user.username);
    //     setUserId(response.data.user.id);

    //     Cookies.set('token', response.data.token, {
    //       expires: 1,
    //     });
    //     localStorage.setItem(
    //       'username',
    //       JSON.stringify(response.data.user.username)
    //     );
    //     localStorage.setItem('userId', JSON.stringify(response.data.user.id));

    //     await getData();

    //     navigate('/');
    //   }
    // } catch (error) {
    //   setError('Please enter the valid credentials again.');
    //   setTimeout(() => {
    //     setError(null);
    //   }, 4000);
    // }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    setCurrentUser(null);
    navigate('/login');
  };
  setTimeout(() => {
    handleLogout();
  }, 24 * 60 * 60 * 1000);

  const [search, setSearch] = useState('');

  return (
    <NoteContext.Provider
      value={{
        getData,
        data,
        isLoading,
        onDelete,
        handleInputChange,
        handleSubmit,
        note,
        setNote,
        currentUser,
        Login,
        error,
        handleLogout,
        userId,
        deleteUserAccount,
        setSearch,
        search,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
}

export default NoteProvider;
