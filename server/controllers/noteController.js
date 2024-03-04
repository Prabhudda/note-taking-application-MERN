import Note from '../models/NotesModel.js';

export const getNotes = async (req, res) => {
  const userId = req.headers.authorization;
  try {
    const notes = await Note.find({ userId });
    res.json({ data: notes });
  } catch (error) {
    res.status(500).json({ error: 'Database query error' });
  }
};

export const createNote = async (req, res) => {
  const { title, description, userId } = req.body;
  try {
    const newNote = new Note({
      title,
      description,
      userId,
      createdDate: new Date().toISOString().split('T')[0],
    });
    await newNote.save();
    res.json({ message: 'Data inserted into the database', data: newNote });
  } catch (error) {
    res.status(500).json({ error: 'Database query error' });
  }
};

export const deleteNote = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await Note.deleteOne({ _id: id });
    res.json({ message: 'Data deleted from the database', data: result });
  } catch (error) {
    res.status(500).json({ error: 'Database query error' });
  }
};

export const updateNote = async (req, res) => {
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
    res.status(500).json({ error: 'Database query error' });
  }
};

export const deleteUserAccount = async (req, res) => {
  const userId = req.params.userId;
  try {
    // Delete the user account
    await User.findByIdAndDelete(userId);

    // Delete the associated notes
    await Note.deleteMany({ userId });

    res.json({ message: 'User account and associated notes deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Database query error' });
  }
};
