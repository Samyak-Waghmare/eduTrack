import { User } from "../models/user.model.js"
import { CourseProgress } from "../models/courseProgress.model.js"
import bcrypt from "bcryptjs"

export const getPublicPortfolio = async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId).select("name photoUrl bio xp createdAt");
    if (!user) {
        return res.status(404).json({ message: "User not found", success: false });
    }

    const completedCourses = await CourseProgress.find({ userId, completed: true }).populate({
        path: "courseId",
        select: "title category thumbnail level"
    });

    return res.status(200).json({
        success: true,
        portfolio: {
            user,
            completedCourses: completedCourses.map(cp => cp.courseId).filter(Boolean)
        }
    });
};
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
import { sendEmail, getWelcomeEmailTemplate } from "../utils/sendEmail.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const register = async (req, res) => {
    let {name, email, password} = req.body;
    if(!name || !email || !password){
        return res.status(400).json({
            success: false,
            message: "All fields are required."
        })
    }
    email = email.trim().toLowerCase();
    name = name.trim();
    if(!EMAIL_REGEX.test(email)){
        return res.status(400).json({
            success: false,
            message: "Please enter a valid email address."
        })
    }
    if(password.length < 6){
        return res.status(400).json({
            success: false,
            message: "Password must be at least 6 characters long."
        })
    }
    const user = await User.findOne({email})
    if(user){
        return res.status(400).json({
            success: false,
            message: "User already exist with this email"
        })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    await User.create({
        name,
        email,
        password:hashedPassword
    })

    sendEmail({
        to: email,
        subject: "Welcome to LMS Platform",
        html: getWelcomeEmailTemplate(name)
    });

    return res.status(201).json({
        success: true,
        message: "Account created successfully."
    })
}

export const login = async (req, res) => {
    let {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({
            success: false,
            message: "All fields are required."
        })
    }
    email = email.trim().toLowerCase();
    const user = await User.findOne({email})

    if(!user){
        return res.status(400).json({
            success: false,
            message: "Incorrect email or password"
        })
    }
    
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if(!isPasswordMatch){
        return res.status(400).json({
            success: false,
            message: "Incorrect email or password"
        })
    }
    generateToken(res, user, `Welcome back ${user.name}`)
}

export const logout = async (_, res) => {
    return res.status(200).cookie("token", "", { maxAge: 0, sameSite: 'none', secure: true }).json({
        message: "Logged out successfully.",
        success: true
    })
}

export const getUserProfile = async (req, res) => {
    const userId = req.id;
    const user = await User.findById(userId).select("-password").populate("enrolledCourses");
    if(!user){
        return res.status(404).json({
            message: "Profile not found",
            success: false
        })
    }
    
    const completedCoursesCount = await CourseProgress.countDocuments({ userId, completed: true });

    return res.status(200).json({
        success: true,
        user: { ...user.toObject(), completedCoursesCount }
    })
}

export const updateProfile = async (req, res) => {
    const userId = req.id;
    const { name, bio } = req.body;
    const profilePhoto = req.file;

    const user = await User.findById(userId);
    if(!user){
        return res.status(404).json({
            message: "User not found",
            success: false
        })
    }

    let photoUrl = user.photoUrl;
    if(profilePhoto){
        if(user.photoUrl){
            const publicId = user.photoUrl.split("/").pop().split(".")[0];
            deleteMediaFromCloudinary(publicId);
        }
        const cloudResponse = await uploadMedia(profilePhoto.path);
        photoUrl = cloudResponse.secure_url;
    }

    const updatedData = { photoUrl };
    if(name !== undefined) updatedData.name = name;
    if(bio !== undefined) updatedData.bio = bio;
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true }).select("-password");

    return res.status(200).json({
        success: true,
        user: updatedUser,
        message: "Profile updated successfully."
    })
}

export const getLeaderboard = async (req, res) => {
    const topUsers = await User.find({ role: "Student", xp: { $gt: 0 } })
        .sort({ xp: -1 })
        .limit(10)
        .select("name photoUrl xp");
        
    return res.status(200).json({
        success: true,
        leaderboard: topUsers
    });
};