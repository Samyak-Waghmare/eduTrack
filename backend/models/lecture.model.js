import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
    lectureTitle: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String
    },
    publicId: {
        type: String
    },
    isPreviewFree: {
        type: Boolean,
        default: false
    },
    subtitleUrl: {
        type: String
    },
    subtitlePublicId: {
        type: String
    }
}, { timestamps: true });

export const Lecture = mongoose.model("Lecture", lectureSchema);
