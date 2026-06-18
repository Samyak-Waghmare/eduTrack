import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subTitle: {
        type: String
    },
    description: {
        type: String
    },
    category: {
        type: String,
        required: true
    },
    level: {
        type: String,
        enum: ["Beginner", "Medium", "Advance"],
        default: "Beginner"
    },
    price: {
        type: Number
    },
    thumbnail: {
        type: String
    },
    enrolledStudents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    lectures: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lecture"
        }
    ],
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    isPublished: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

courseSchema.index({ title: 'text', subTitle: 'text' });
courseSchema.index({ creator: 1 });
courseSchema.index({ isPublished: 1, category: 1, level: 1, price: 1 });

export const Course = mongoose.model("Course", courseSchema);
