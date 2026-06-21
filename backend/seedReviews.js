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
    { name: "Marcus Johnson", email: "marcus.j@example.com", photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus" },
    { name: "Priya Patel", email: "priya.p@example.com", photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya" },
    { name: "Omar Farooq", email: "omar.f@example.com", photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Omar" },
    { name: "Elena Rodriguez", email: "elena.r@example.com", photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena" }
];

const realisticReviews = [
    // Positive but realistic
    "Really solid course. The instructor clearly knows what they're talking about, though a few sections dragged a bit. Overall, definitely worth the money.",
    "I took this over the weekend and was surprised by how much I picked up. The exercises are pretty well thought out.",
    "Not bad at all. I had some background knowledge going in, but this helped fill in the gaps perfectly.",
    "Great stuff. The audio quality could be a tiny bit better in the earlier videos, but the content makes up for it.",
    "This was exactly what my boss wanted me to learn. Straight to the point, no fluff.",
    "Honestly one of the better courses I've found on this topic. It doesn't waste your time.",
    "I was skeptical at first, but the final project really tied everything together for me.",
    "Solid 4.5/5. The instructor's voice is super clear and easy to follow. A few more real-world examples would make it perfect.",
    "Good pacing for the most part. The advanced section ramped up quickly, but rewatching it cleared things up.",
    "Finally, a course that actually explains the 'why' and not just the 'how'. Highly recommend.",
    "I've bought a few courses on this subject before and gave up. This one finally made it click for me.",
    "Pretty good! I ran into a bug on chapter 3, but found the fix in the Q&A section quickly.",
    "The quality is fantastic. You can tell a lot of effort went into the curriculum design.",
    "Worth the price just for the downloadable resources alone. Very helpful reference material.",
    "I normally don't leave reviews, but this really helped me land my first junior role. Thanks!",
    "It's a dense course. You definitely need to pause and practice, but the payoff is huge.",
    "Very straightforward and practical. No unnecessary theory, just pure application.",
    "Loved the section on best practices. I've been doing things the hard way for months.",
    "Clear, concise, and professional. Everything worked exactly as shown in the videos.",
    "A great refresher. I skimmed the basics and jumped straight into the projects."
];

const seedReviews = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // Clear existing reviews so we can start fresh
        await Review.deleteMany({});
        console.log("Cleared old duplicate reviews.");

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

        // 3. Seed new realistic reviews
        let totalReviewsAdded = 0;
        // Keep track of used reviews so we don't repeat them too often
        let usedReviews = new Set();

        for (const course of courses) {
            // Assign 4 to 8 random reviews per course
            const numReviews = Math.floor(Math.random() * 5) + 4;
            // Shuffle users
            const shuffledUsers = [...fakeUsers].sort(() => 0.5 - Math.random());
            
            for (let i = 0; i < numReviews && i < shuffledUsers.length; i++) {
                const user = shuffledUsers[i];
                
                // Add some realistic rating variance (mostly 4 and 5)
                let rating;
                const rand = Math.random();
                if (rand > 0.6) rating = 5;
                else if (rand > 0.2) rating = 4;
                else rating = 3;

                // Pick a review we haven't used recently
                let commentIndex;
                do {
                    commentIndex = Math.floor(Math.random() * realisticReviews.length);
                } while (usedReviews.has(commentIndex) && usedReviews.size < realisticReviews.length);
                
                usedReviews.add(commentIndex);
                if (usedReviews.size >= realisticReviews.length) usedReviews.clear(); // reset when all used

                const comment = realisticReviews[commentIndex];

                await Review.create({
                    user: user._id,
                    course: course._id,
                    rating,
                    comment
                });
                totalReviewsAdded++;
            }
            console.log(`Added diverse reviews for: ${course.title}`);
        }

        console.log(`Successfully added ${totalReviewsAdded} realistic fake reviews!`);
        process.exit(0);
    } catch (error) {
        console.error("Error seeding reviews:", error);
        process.exit(1);
    }
};

seedReviews();
