import Notes from "../models/Notes.model.js";

class NotesService {

    async createNote(note_data) {
        const note = new Notes(note_data);
        return await note.save();
    }

    async getNotesByUserId(user_id) {
        return await Notes.find({ user_id: user_id });
    }

    async getNoteById(note_id) {
        return await Notes.findOne({ id: note_id });
    }

    async updateNote(note_id, update_data) {
        return await Notes.findOneAndUpdate({ id: note_id }, update_data, { new: true });
    }

    async deleteNote(note_id) {
        return await Notes.findOneAndDelete({ id: note_id });
    }

}

export default new NotesService();