import { Note } from "../models/note.model.js";

export const createNote = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        const { timestamp, content } = req.body;
        const userId = req.id;

        if (timestamp === undefined || !content) {
            return res.status(400).json({ success: false, message: "Timestamp and content are required" });
        }

        const note = await Note.create({
            user: userId,
            courseId,
            lectureId,
            timestamp,
            content
        });

        return res.status(201).json({ success: true, message: "Note added", note });
    } catch (error) {

        return res.status(500).json({ success: false, message: "Failed to create note" });
    }
};

export const getNotesByLecture = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const userId = req.id;

        const notes = await Note.find({ lectureId, user: userId }).sort({ timestamp: 1 });

        return res.status(200).json({ success: true, notes });
    } catch (error) {

        return res.status(500).json({ success: false, message: "Failed to fetch notes" });
    }
};

export const deleteNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        const userId = req.id;

        const note = await Note.findOneAndDelete({ _id: noteId, user: userId });

        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found or unauthorized" });
        }

        return res.status(200).json({ success: true, message: "Note deleted successfully" });
    } catch (error) {

        return res.status(500).json({ success: false, message: "Failed to delete note" });
    }
};
