import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true,
    },
    options: [{
        type: String,
        required: true
    }],
    correctAnswerIndex: {
        type: Number,
        required: true
    }
});

const quizSchema = new mongoose.Schema({
    lectureId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
        required: true,
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    questions: [questionSchema]
}, { timestamps: true });

export const Quiz = mongoose.model("Quiz", quizSchema);
