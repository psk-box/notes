import NotesController from "../controllers/Notes.controller.js";

import express from "express";

const router = express.Router();

router.post("/", NotesController.createNote);
router.get("/user/:user_id", NotesController.getNotesByUserId);
router.get("/:note_id", NotesController.getNoteById);
router.put("/:note_id", NotesController.updateNote);
router.delete("/:note_id", NotesController.deleteNote);

export default router;