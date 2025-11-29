import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    user_id: { type: Number, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Notes = mongoose.model("Notes", noteSchema);

export default Notes;