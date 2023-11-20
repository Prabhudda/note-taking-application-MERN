import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookie from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();
let PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookie());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'notes',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to the database');
  }
});

// app.get('/', (req, res) => {
//   const q = 'SELECT * FROM notes';
//   db.query(q, (err, result) => {
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
//   const q = 'INSERT INTO notes (`title`, `description`) VALUES (?, ?)';
//   db.query(q, [title, description], (err, result) => {
//     if (err) {
//       console.error('Database query error:', err.message);
//       res.status(500).json({ error: 'Database query error' });
//     } else {
//       console.log(result);
//       res.json({ message: 'Data inserted into the database', data: result });
//     }
//   });
// });

//////-------------------------------

app.post('/create', (req, res) => {
  const { title, description } = req.body;
  const userId = req.body.userId;
  const q =
    'INSERT INTO notes (`title`, `description`, `userId`) VALUES (?, ?, ?)';
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

    const q = 'SELECT * FROM users WHERE username=? OR email=?';

    db.query(q, [username, email], (err, result) => {
      if (err) {
        console.error('Database query error:', err.message);
        return res
          .status(500)
          .json({ error: 'Error checking user availability' });
      }

      if (result.length > 0) {
        return res.json({
          message:
            "You're already registered with your Email ! , please proceed to login.",
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
    return res.status(500).json({ error: 'Internal server error' });
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
