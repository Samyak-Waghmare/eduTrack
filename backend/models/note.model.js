import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    lectureId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
        required: true
    },
    timestamp: {
        type: Number, 
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const Note = mongoose.model("Note", noteSchema);
