import express from 'express';
import {
  getNotes,
  createNote,
  deleteNote,
  updateNote,
  deleteUserAccount,
} from '../controllers/noteController.js';

const router = express.Router();

router.get('/', getNotes);
router.post('/create', createNote);
router.delete('/delete/:id', deleteNote);
router.put('/update/:id', updateNote);
router.delete('/delete/account/:userId', deleteUserAccount);

export default router;
