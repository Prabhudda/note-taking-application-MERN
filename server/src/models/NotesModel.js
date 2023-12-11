import mongoose from 'mongoose';

const NoteSchema = mongoose.Schema({
  title: String,
  description: String,
  userId: String,
  createdDate: { type: Date, default: Date.now },
});

const Note = mongoose.model('Note', NoteSchema);

export default Note;
