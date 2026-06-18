import express from "express";
import { createNote, getNotesByLecture, deleteNote } from "../controllers/note.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route("/:courseId/:lectureId").post(isAuthenticated, createNote);
router.route("/:lectureId").get(isAuthenticated, getNotesByLecture);
router.route("/:noteId").delete(isAuthenticated, deleteNote);

export default router;
