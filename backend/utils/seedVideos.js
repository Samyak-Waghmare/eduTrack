import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

import { User } from "../models/user.model.js";
import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const adminEmail = "admin@example.com";
        const existingAdmin = await User.findOne({ email: adminEmail });
        
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash("12345", 10);
            await User.create({
                name: "Admin Manager",
                email: adminEmail,
                password: hashedPassword,
                role: "Admin",
                photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
            });
        }

        const courses = await Course.find({});
        if (courses.length === 0) {
            process.exit(1);
        }

        const dummyVideos = [
            "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
        ];

        let addedCount = 0;

        for (const course of courses) {
            if (course.lectures && course.lectures.length > 0) {
                continue;
            }

            const lecture1 = await Lecture.create({
                lectureTitle: "Introduction to the Course",
                videoUrl: dummyVideos[0],
                publicId: "dummy_1",
                isPreviewFree: true
            });

            const lecture2 = await Lecture.create({
                lectureTitle: "Deep Dive into Concepts",
                videoUrl: dummyVideos[1],
                publicId: "dummy_2",
                isPreviewFree: false
            });

            const lecture3 = await Lecture.create({
                lectureTitle: "Practical Examples",
                videoUrl: dummyVideos[2],
                publicId: "dummy_3",
                isPreviewFree: false
            });

            course.lectures = [lecture1._id, lecture2._id, lecture3._id];
            await course.save();
            addedCount++;
        }

        process.exit(0);

    } catch (error) {
        process.exit(1);
    }
};

run();
