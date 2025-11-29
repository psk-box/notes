import NotesService from "../services/Notes.service.js";

class NotesController {

    async createNote(req, res) {
        try {
            const note_data = req.body;

            if (!note_data.user_id || !note_data.content) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            const newNote = await NotesService.createNote(note_data);
            res.status(201).json({ message: "Note created successfully", note: newNote });
        } catch (error) {
            res.status(500).json({ message: "Error creating note", error: error.message });
        }
    }

    async getNotesByUserId(req, res) {
        try {
            const user_id = req.params.user_id;

            if (!user_id) {
                return res.status(400).json({ message: "User ID is required" });
            }

            if (isNaN(user_id)) {
                return res.status(400).json({ message: "User ID must be a number" });
            }

            const notes = await NotesService.getNotesByUserId(user_id);
            res.status(200).json(notes);
        } catch (error) {
            res.status(500).json({ message: "Error fetching notes", error: error.message });
        }
    }

    async getNoteById(req, res) {
        try {
            const note_id = req.params.note_id;

            if (!note_id) {
                return res.status(400).json({ message: "Note ID is required" });
            }

            const note = await NotesService.getNoteById(note_id);
            if (note) {
                res.status(200).json(note);
            } else {
                res.status(404).json({ message: "Note not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error fetching note", error: error.message });
        }
    }

    async updateNote(req, res) {
        try {
            const note_id = req.params.note_id;
            const update_data = req.body;
            const updatedNote = await NotesService.updateNote(note_id, update_data);
            if (updatedNote) {
                res.status(200).json({ message: "Note updated successfully", note: updatedNote });
            } else {
                res.status(404).json({ message: "Note not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error updating note", error: error.message });
        }
    }

    async deleteNote(req, res) {
        try {
            const note_id = req.params.note_id;

            if (!note_id) {
                return res.status(400).json({ message: "Note ID is required" });
            }

            const deletedNote = await NotesService.deleteNote(note_id);
            if (deletedNote) {
                res.status(200).json({ message: "Note deleted successfully" });
            } else {
                res.status(404).json({ message: "Note not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error deleting note", error: error.message });
        }
    }

}

export default new NotesController();