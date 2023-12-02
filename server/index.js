import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookie from 'cookie-parser';
import dotenv from 'dotenv';
import fs from 'fs';

const caFilePath = './ca.pem';

dotenv.config();
let PORT = process.env.PORT;

const app = express();

app.use(
  // cors({
  //   origin: 'https://note-taking-application-frontend.onrender.com',
  // })

  cors({
    origin: 'https://note-hub-application.netlify.app',
  })

  // cors({
  //   origin: 'http://localhost:3000',
  // })
);
app.use(express.json());
app.use(cookie());

const db = mysql.createPool({
  // connectionLimit: 30,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  queueLimit: 0,
  connectionLimit: 1000,
  connectTimeout: 60 * 60 * 1000,
  acquireTimeout: 60 * 60 * 1000,
  timeout: 60 * 60 * 1000,
  ssl: {
    ca: fs.readFileSync(caFilePath),
    rejectUnauthorized: true,
  },
});

db.getConnection((err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to the database');
  }
});

// const verifyToken = (req, res, next) => {
//   const token = req.cookies.token;

//   if (!token) {
//     return res.status(401).json({ error: 'Unauthorized: Missing token' });
//   }

//   jwt.verify(token, process.env.JWT_KEY, (err, result) => {
//     if (err) {
//       return res.status(401).json({ error: 'Unauthorized: Invalid token' });
//     }

//     req.username = result.username;
//     next();
//   });
// };

// app.use(verifyToken);

app.post('/create', (req, res) => {
  const { title, description } = req.body;
  const userId = req.body.userId;
  const q =
    'INSERT INTO notes (`title`, `description`, `userId`,`createdDate`) VALUES (?, ?, ?,CURDATE())';
  db.query(q, [title, description, userId], (err, result) => {
    if (err) {
      console.error('Database query error:', err.message);
      res.status(500).json({ error: 'Database query error' });
    } else {
      console.log(result);
      res.json({ message: 'Data inserted into the database', data: result });
    }
  });
});
app.get('/', (req, res) => {
  const userId = req.headers.authorization;
  const q = 'SELECT * FROM notes WHERE userId = ?';
  db.query(q, [userId], (err, result) => {
    if (err) {
      console.error('Database query error:', err.message);
      res.status(500).json({ error: 'Database query error' });
    } else {
      res.json({ data: result });
    }
  });
});

////----------------------------------

app.delete('/delete/:id', (req, res) => {
  const id = req.params.id;
  const q = 'DELETE FROM notes WHERE id = ?';
  db.query(q, [id], (err, result) => {
    if (err) {
      console.error('Database query error:', err.message);
      res.status(500).json({ error: 'Database query error' });
    } else {
      console.log(result);
      res.json({ message: 'Data deleted from the database', data: result });
    }
  });
});

app.delete('/delete/account/:userId', (req, res) => {
  const userId = req.params.userId;
  console.log(userId);
  let q = 'delete from users where id = ?';
  db.query(q, [userId], (err, result) => {
    if (err) return res.json({ message: 'unable to delete your accout' });
    // console.log(result);
    return res.json({ message: result });
  });
});

app.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const sql = 'UPDATE notes SET title = ?, description = ? WHERE id = ?';
  db.query(sql, [title, description, id], (err, result) => {
    if (err) {
      console.error('Database query error:', err.message);
      res.status(500).json({ error: 'Database query error' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Note not found' });
    } else {
      res.json({ message: 'Note updated' });
    }
  });
});

app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      password + process.env.HASH_KEY,
      saltRounds
    );

    const q = 'SELECT * FROM users WHERE email=?';

    db.query(q, [email], (err, result) => {
      if (err) {
        console.error('Database query error:', err.message);
        return res
          .status(500)
          .json({ error: 'Error checking user availability' });
      }

      if (result.length > 0) {
        return res.json({
          message:
            "You're already registered with your Email ! , please login.",
        });
      }

      const sql =
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      db.query(sql, [username, email, hashedPassword], (err, result) => {
        if (err) {
          console.error('Database query error:', err.message);
          return res
            .status(500)
            .json({ error: 'Error during user registration' });
        }

        return res.json({
          message: 'User registered successfully ! Please proceed to login.',
          data: { result },
        });
      });
    });
  } catch (error) {
    console.error('Error during user registration:', error.message);
    return res.status(500).json({ error: error });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const q = 'SELECT * FROM users WHERE username=?';

    db.query(q, [username], async (err, result) => {
      if (err) {
        console.error('Database query error:', err.message);
        return res
          .status(500)
          .json({ error: 'Error checking user availability' });
      }

      if (result.length > 0) {
        const comparePassword = await bcrypt.compare(
          password + process.env.HASH_KEY,
          result[0].password
        );

        if (comparePassword) {
          let { password, ...user } = result[0];
          const token = jwt.sign({ username }, process.env.JWT_KEY, {
            expiresIn: '1d',
          });
          res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
          });
          return res.json({ message: 'User logged in', token, user });
        } else {
          return res.status(401).json({ error: 'Invalid credentials' });
        }
      } else {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    });
  } catch (error) {
    console.error('Error during user login:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log('Server is running on port 8080');
});
