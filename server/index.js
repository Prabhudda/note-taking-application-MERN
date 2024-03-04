// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import cookie from 'cookie-parser';
// import dotenv from 'dotenv';
// dotenv.config();

// const app = express();
// const currentDate = new Date().toISOString().split('T')[0];

// const PORT = process.env.PORT || 8082;
// const JWT_SECRET = process.env.JWT_KEY;
// const MANGODB_URI = process.env.MANGODB_URI;

// //middlewares
// app.use(cors({ origin: 'https://note-taking-application-mern.netlify.app' }));
// app.use(express.json());
// app.use(cookie());

// // Connect to MongoDB
// mongoose.connect(`${MANGODB_URI}`, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// mongoose.connection.on('error', (error) => {
//   console.error('MongoDB connection error:', error);
// });

// mongoose.connection.once('open', () => {
//   console.log('Connected to MongoDB');
// });

// // Define Mongoose schema and models
// import Note from '../server/models.NotesModel.js';
// import User from '../server/models.UserModel.js';

// // Registration route
// app.post('/register', async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const userFound = await User.findOne({ email: email });

//     // Save user to the database
//     if (!userFound) {
//       const newUser = await User.create({
//         username,
//         email,
//         password: hashedPassword,
//       });
//       // Generate JWT token
//       const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
//         expiresIn: '1d',
//       });

//       // Set token in cookie
//       res.cookie('token', token, {
//         httpOnly: true,
//         secure: true,
//         sameSite: 'Strict',
//       });

//       res.json({
//         message: 'User registered successfully',
//         user: {
//           username: newUser.username,
//           email: newUser.email,
//           userId: newUser._id,
//           password: password,
//         },
//       });
//     } else {
//       res.json({ message: 'User, you are already registered. Please login' });
//     }
//   } catch (error) {
//     // console.error('Error registering user:', error.message);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Login route
// app.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find user by email
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     // Compare passwords
//     const match = await bcrypt.compare(password, user.password);

//     if (!match) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
//       expiresIn: '1d',
//     });

//     // Set token in cookie
//     res.cookie('token', token, {
//       httpOnly: true,
//       secure: true,
//       sameSite: 'Strict',
//     });

//     res.json({
//       message: 'User logged in successfully',
//       user: {
//         username: user.username,
//         email: user.email,
//         id: user._id,
//         token,
//       },
//     });
//   } catch (error) {
//     // console.error('Error logging in:', error.message);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Get notes route
// app.get('/', async (req, res) => {
//   const userId = req.headers.authorization;
//   try {
//     const notes = await Note.find({ userId });
//     res.json({ data: notes });
//   } catch (error) {
//     // console.error('Database query error:', error.message);
//     res.status(500).json({ error: 'Database query error' });
//   }
// });

// // Create note route
// app.post('/create', async (req, res) => {
//   const { title, description, userId } = req.body;
//   try {
//     const newNote = new Note({
//       title,
//       description,
//       userId,
//       createdDate: currentDate,
//     });
//     await newNote.save();
//     res.json({ message: 'Data inserted into the database', data: newNote });
//   } catch (error) {
//     // console.error('Database query error:', error.message);
//     res.status(500).json({ error: 'Database query error' });
//   }
// });

// // Delete note route
// app.delete('/delete/:id', async (req, res) => {
//   const id = req.params.id;
//   try {
//     const result = await Note.deleteOne({ _id: id });
//     // console.log(result);
//     res.json({ message: 'Data deleted from the database', data: result });
//   } catch (error) {
//     // console.error('Database query error:', error.message);
//     res.status(500).json({ error: 'Database query error' });
//   }
// });

// // Delete account and associated notes route
// app.delete('/delete/account/:userId', async (req, res) => {
//   const userId = req.params.userId;
//   try {
//     // Delete the user account
//     await User.findByIdAndDelete(userId);

//     // Delete the associated notes
//     const result = await Note.deleteMany({ userId });

//     // console.log(result);
//     res.json({ message: 'User account and associated notes deleted' });
//   } catch (error) {
//     // console.error('Database query error:', error.message);
//     res.status(500).json({ error: 'Database query error' });
//   }
// });

// // Update note route
// app.put('/update/:id', async (req, res) => {
//   const { id } = req.params;
//   const { title, description } = req.body;
//   try {
//     const result = await Note.updateOne({ _id: id }, { title, description });
//     if (result === 0) {
//       res.status(404).json({ error: 'Note not found' });
//     } else {
//       res.json({ message: 'Note updated' });
//     }
//   } catch (error) {
//     // console.error('Database query error:', error.message);
//     res.status(500).json({ error: 'Database query error' });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import noteRoutes from './routes/noteRoutes.js';

import User from '../server/models/UserModel.js';
import Note from '../server/models/NotesModel.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8082;
const MANGODB_URI = process.env.MANGODB_URI;

//middlewares
app.use(cors({ origin: 'https://note-taking-application-mern.netlify.app' }));
app.use(express.json());
app.use(cookieParser());

app.use('/', authRoutes);
app.use('/', noteRoutes);

//database connection
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

app.delete('/delete/account/:userId', async (req, res) => {
  const userId = req.params.userId;
  console.log(userId);
  try {
    // Delete the user account
    await User.findByIdAndDelete(userId);

    // Delete the associated notes
    await Note.deleteMany({ userId });

    res.json({ message: 'User account and associated notes deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Database query error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
