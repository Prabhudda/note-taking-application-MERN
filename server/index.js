import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookie from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const currentDate = new Date().toISOString().split('T')[0];

const PORT = process.env.PORT || 8082;
const JWT_SECRET = process.env.JWT_KEY;
const MANGODB_URI = process.env.MANGODB_URI;

//middlewares
app.use(cors());
app.use(express.json());
app.use(cookie());

// Connect to MongoDB
mongoose.connect(`${MANGODB_URI}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define Mongoose schema and models
import Note from './src/models/NotesModel.js';
import User from './src/models/UserModel.js';

// Registration route
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to the database
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: '1d',
    });

    // Set token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
    });

    res.json({
      message: 'User registered successfully',
      user: {
        username: newUser.username,
        email: newUser.email,
        userId: newUser._id,
        password: password,
      },
    });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid Email id' });
    }

    // Compare passwords
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: '1d',
    });

    // Set token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
    });

    res.json({
      message: 'User logged in successfully',
      user: {
        username: user.username,
        email: user.email,
        id: user._id,
        token,
      },
    });
  } catch (error) {
    console.error('Error logging in:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get notes route
app.get('/', async (req, res) => {
  const userId = req.headers.authorization;
  try {
    const notes = await Note.find({ userId });
    res.json({ data: notes });
  } catch (error) {
    console.error('Database query error:', error.message);
    res.status(500).json({ error: 'Database query error' });
  }
});

// Create note route
app.post('/create', async (req, res) => {
  const { title, description, userId } = req.body;
  try {
    const newNote = new Note({
      title,
      description,
      userId,
      createdDate: currentDate,
    });
    await newNote.save();
    res.json({ message: 'Data inserted into the database', data: newNote });
  } catch (error) {
    console.error('Database query error:', error.message);
    res.status(500).json({ error: 'Database query error' });
  }
});

// Delete note route
app.delete('/delete/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await Note.deleteOne({ _id: id });
    console.log(result);
    res.json({ message: 'Data deleted from the database', data: result });
  } catch (error) {
    console.error('Database query error:', error.message);
    res.status(500).json({ error: 'Database query error' });
  }
});

// Delete account and associated notes route
app.delete('/delete/account/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    // Delete the user account
    await User.findByIdAndDelete(userId);

    // Delete the associated notes
    const result = await Note.deleteMany({ userId });

    console.log(result);
    res.json({ message: 'User account and associated notes deleted' });
  } catch (error) {
    console.error('Database query error:', error.message);
    res.status(500).json({ error: 'Database query error' });
  }
});

// Update note route
app.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    const result = await Note.updateOne({ _id: id }, { title, description });
    if (result === 0) {
      res.status(404).json({ error: 'Note not found' });
    } else {
      res.json({ message: 'Note updated' });
    }
  } catch (error) {
    console.error('Database query error:', error.message);
    res.status(500).json({ error: 'Database query error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// import express from 'express';
// import mysql from 'mysql';
// import cors from 'cors';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import cookie from 'cookie-parser';
// import dotenv from 'dotenv';

// dotenv.config();
// let PORT = process.env.PORT;

// const app = express();

// const currentDate = new Date().toISOString().split('T')[0];

// app.use(
//   // cors({
//   //   origin: 'https://note-hub-application.netlify.app',
//   // })
//   cors({
//     origin: 'http://localhost:3000',
//   })
// );
// app.use(express.json());
// app.use(cookie());

// const db = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

//   // waitForConnections: true,
//   // queueLimit: 0,
//   // connectionLimit: 30,

// db.getConnection((err) => {
//   if (err) {
//     console.error('Database connection error:', err.message);
//   } else {
//     console.log('Connected to the database');
//   }
// });

// app.get('/', (req, res) => {
//   const userId = req.headers.authorization;
//   const q = 'SELECT * FROM notes WHERE userId = ?';
//   db.query(q, [userId], (err, result) => {
//     if (err) {
//       console.error('Database query error:', err.message);
//       res.status(500).json({ error: 'Database query error' });
//     } else {
//       res.json({ data: result });
//     }
//   });
// });

// app.post('/create', (req, res) => {
//   const { title, description } = req.body;
//   const userId = req.body.userId;
//   const q =
//     'INSERT INTO notes (`title`, `description`, `userId`,`createdDate`) VALUES (?, ?, ?, ?)';
//   db.query(q, [title, description, userId, currentDate], (err, result) => {
//     if (err) {
//       console.error('Database query error:', err.message);
//       res.status(500).json({ error: 'Database query error' });
//     } else {
//       console.log(result);
//       res.json({ message: 'Data inserted into the database', data: result });
//     }
//   });
// });

// ////----------------------------------

// app.delete('/delete/:id', (req, res) => {
//   const id = req.params.id;
//   const q = 'DELETE FROM notes WHERE id = ?';
//   db.query(q, [id], (err, result) => {
//     if (err) {
//       console.error('Database query error:', err.message);
//       res.status(500).json({ error: 'Database query error' });
//     } else {
//       console.log(result);
//       res.json({ message: 'Data deleted from the database', data: result });
//     }
//   });
// });

// app.delete('/delete/account/:userId', (req, res) => {
//   const userId = req.params.userId;
//   console.log(userId);
//   let q = 'delete from users where id = ?';
//   db.query(q, [userId], (err, result) => {
//     if (err) return res.json({ message: 'unable to delete your accout' });
//     return res.json({ message: result });
//   });
// });

// app.put('/update/:id', (req, res) => {
//   const { id } = req.params;
//   const { title, description } = req.body;
//   const sql = 'UPDATE notes SET title = ?, description = ? WHERE id = ?';
//   db.query(sql, [title, description, id], (err, result) => {
//     if (err) {
//       console.error('Database query error:', err.message);
//       res.status(500).json({ error: 'Database query error' });
//     } else if (result.affectedRows === 0) {
//       res.status(404).json({ error: 'Note not found' });
//     } else {
//       res.json({ message: 'Note updated' });
//     }
//   });
// });

// app.post('/register', async (req, res) => {
//   try {
//     const { username, email, password } = req.body;
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(
//       password + process.env.HASH_KEY,
//       saltRounds
//     );

//     const q = 'SELECT * FROM users WHERE email=?';

//     db.query(q, [email], (err, result) => {
//       if (err) {
//         console.error('Database query error:', err.message);
//         return res
//           .status(500)
//           .json({ error: 'Error checking user availability' });
//       }

//       if (result.length > 0) {
//         return res.json({
//           message:
//             "You're already registered with your Email ! , please login.",
//           loading: false,
//         });
//       }

//       const sql =
//         'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
//       db.query(sql, [username, email, hashedPassword], (err, result) => {
//         if (err) {
//           console.error('Database query error:', err.message);
//           return res
//             .status(500)
//             .json({ error: 'Error during user registration' });
//         }

//         return res.json({
//           message: 'User registered successfully ! Please proceed to login.',
//           loading: false,
//           data: { result },
//         });
//       });
//     });
//   } catch (error) {
//     console.error('Error during user registration:', error.message);
//     return res.status(500).json({ error: error });
//   }
// });

// app.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const q = 'SELECT * FROM users WHERE email=?';

//     db.query(q, [email], async (err, result) => {
//       if (err) {
//         console.error('Database query error:', err.message);
//         return res
//           .status(500)
//           .json({ error: 'Error checking user availability' });
//       }

//       if (result.length > 0) {
//         const comparePassword = await bcrypt.compare(
//           password + process.env.HASH_KEY,
//           result[0].password
//         );

//         if (comparePassword) {
//           let { password, ...user } = result[0];
//           const token = jwt.sign({ email }, process.env.JWT_KEY, {
//             expiresIn: '1d',
//           });
//           res.cookie('token', token, {
//             httpOnly: true,
//             secure: true,
//             sameSite: 'Strict',
//           });
//           return res.json({ message: 'User logged in', token, user });
//         } else {
//           return res.status(401).json({ error: 'Invalid credentials' });
//         }
//       } else {
//         return res.status(401).json({ error: 'Invalid credentials' });
//       }
//     });
//   } catch (error) {
//     console.error('Error during user login:', error.message);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
