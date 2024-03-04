import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_KEY;

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const userFound = await User.findOne({ email: email });

    if (!userFound) {
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
      });

      const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
        expiresIn: '1d',
      });

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
    } else {
      res.json({ message: 'User already registered. Please login' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: '1d',
    });

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
    res.status(500).json({ error: 'Internal server error' });
  }
};
