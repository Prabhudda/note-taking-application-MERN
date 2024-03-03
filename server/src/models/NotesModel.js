import mongoose from 'mongoose';

const NoteSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdDate: { type: Date, default: Date.now },
});

const Note = mongoose.model('Note', NoteSchema);

export default Note;
