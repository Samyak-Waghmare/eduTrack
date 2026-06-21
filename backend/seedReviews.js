import mongoose from "mongoose";
import dotenv from "dotenv";
import { Review } from "./models/review.model.js";
import { Course } from "./models/course.model.js";
import { User } from "./models/user.model.js";
import bcrypt from "bcryptjs";

dotenv.config();

const fakeUsersData = [
    { name: "Alex Carter", email: "alex.c@example.com", photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" },
    { name: "Sarah Jenkins", email: "sarah.j@example.com", photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
    { name: "Michael Chen", email: "michael.c@example.com", photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael" },
    { name: "Emily Stone", email: "emily.s@example.com", photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily" },
    { name: "David Kim", email: "david.k@example.com", photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=David" },
    { name: "Jessica Taylor", email: "jessica.t@example.com", photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica" },
];

const fakeReviews = [
    "This course was exactly what I needed! The concepts were explained perfectly.",
    "Highly recommended! The instructor is very knowledgeable and the pacing is great.",
    "I've learned so much from this. The practical examples were the best part.",
    "Great content, but I wish some sections went a bit deeper. Still a solid 4 stars.",
    "Absolutely brilliant. Worth every penny. I can't wait to apply these skills.",
    "Very well structured and easy to follow. Perfect for beginners.",
    "The quality of the video and audio is top-notch. Great learning experience.",
    "A bit fast-paced for me, but the provided resources helped a lot to catch up."
];

const seedReviews = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // 1. Create fake users
        const password = await bcrypt.hash("password123", 10);
        let fakeUsers = [];
        for (const u of fakeUsersData) {
            let user = await User.findOne({ email: u.email });
            if (!user) {
                user = await User.create({ ...u, password, role: "Student" });
                console.log(`Created user: ${user.name}`);
            }
            fakeUsers.push(user);
        }

        // 2. Get all courses
        const courses = await Course.find();
        console.log(`Found ${courses.length} courses`);

        // 3. Seed reviews
        let totalReviewsAdded = 0;
        for (const course of courses) {
            const existingReviews = await Review.find({ course: course._id });
            if (existingReviews.length > 0) {
                console.log(`Course ${course.title} already has reviews. Skipping.`);
                continue;
            }

            // Assign 3 to 6 random reviews
            const numReviews = Math.floor(Math.random() * 4) + 3;
            // Shuffle users
            const shuffledUsers = fakeUsers.sort(() => 0.5 - Math.random());
            
            for (let i = 0; i < numReviews; i++) {
                const user = shuffledUsers[i];
                const rating = Math.random() > 0.8 ? 4 : 5; // Mostly 5 stars, some 4 stars
                const comment = fakeReviews[Math.floor(Math.random() * fakeReviews.length)];

                await Review.create({
                    user: user._id,
                    course: course._id,
                    rating,
                    comment
                });
                totalReviewsAdded++;
            }
            console.log(`Added reviews for: ${course.title}`);
        }

        console.log(`Successfully added ${totalReviewsAdded} fake reviews!`);
        process.exit(0);
    } catch (error) {
        console.error("Error seeding reviews:", error);
        process.exit(1);
    }
};

seedReviews();
