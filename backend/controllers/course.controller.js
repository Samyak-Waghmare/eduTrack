import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { deleteMediaFromCloudinary, deleteVideoFromCloudinary, uploadMedia, uploadRawMedia } from "../utils/cloudinary.js";
import { getCourseRatingStats } from "./review.controller.js";
import { redis } from "../utils/redis.js";
import { v2 as cloudinary } from "cloudinary";

export const getCloudinarySignature = async (req, res) => {
    const timestamp = Math.round((new Date).getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
        {
            timestamp: timestamp,
            folder: "lms_videos",
        },
        process.env.CLOUDINARY_API_SECRET
    );

    return res.status(200).json({
        success: true,
        signature,
        timestamp,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY
    });
};

export const uploadSubtitle = async (req, res) => {
    const { lectureId } = req.params;
    const subtitleFile = req.file;

    if (!subtitleFile) {
        return res.status(400).json({ message: "Subtitle file is required", success: false });
    }

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
        return res.status(404).json({ message: "Lecture not found", success: false });
    }

    if (lecture.subtitlePublicId) {
        await deleteMediaFromCloudinary(lecture.subtitlePublicId); 
    }

    const uploadRes = await uploadRawMedia(subtitleFile.path);
    lecture.subtitleUrl = uploadRes.secure_url;
    lecture.subtitlePublicId = uploadRes.public_id;
    await lecture.save();

    return res.status(200).json({
        message: "Subtitle uploaded successfully",
        subtitleUrl: lecture.subtitleUrl,
        success: true
    });
};

export const createCourse = async (req, res) => {
    const { title, category } = req.body;
    if (!title || !category) {
        return res.status(400).json({
            message: "Title and category are required.",
            success: false
        });
    }
    const course = await Course.create({
        title,
        category,
        creator: req.id
    });
    return res.status(201).json({
        course,
        message: "Course Created.",
        success: true
    });
};

export const searchCourse = async (req, res) => {
    try {
        const { query = "", categories = [], sortByPrice = "", level = [], page = 1, limit = 12 } = req.query;

        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const skip = (pageNumber - 1) * limitNumber;

        // Query params may arrive as a single string or an array
        const categoryList = Array.isArray(categories) ? categories : categories ? [categories] : [];
        const levelList = Array.isArray(level) ? level : level ? [level] : [];

        const searchCriteria = { isPublished: true };

        if (query) {
            searchCriteria.$text = { $search: query };
        }

        if (categoryList.length > 0) {
            searchCriteria.category = { $in: categoryList };
        }

        if (levelList.length > 0) {
            searchCriteria.level = { $in: levelList };
        }

        const sortOptions = {};
        if (sortByPrice === "low") sortOptions.price = 1;
        else if (sortByPrice === "high") sortOptions.price = -1;
        
        else if (query) sortOptions.score = { $meta: "textScore" };

        const totalCourses = await Course.countDocuments(searchCriteria);

        const projection = query ? { score: { $meta: "textScore" } } : {};

        let courses = await Course.find(searchCriteria, projection)
            .populate({ path: "creator", select: "name photoUrl" })
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNumber);

        const stats = await getCourseRatingStats(courses.map((c) => c._id));
        courses = courses.map((c) => {
            const s = stats[c._id.toString()] || { rating: 0, reviewCount: 0 };
            return { ...c.toObject(), rating: s.rating, reviewCount: s.reviewCount };
        });

        return res.status(200).json({
            success: true,
            courses: courses || [],
            currentPage: pageNumber,
            totalPages: Math.ceil(totalCourses / limitNumber)
        });
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed to search courses"
        });
    }
};

export const getPublishedCourses = async (_, res) => {
    const cachedCourses = await redis.get("trending_courses");
    if (cachedCourses) {
        return res.status(200).json({
            courses: JSON.parse(cachedCourses),
            success: true
        });
    }

    const courses = await Course.find({ isPublished: true })
        .populate({ path: "creator", select: "name photoUrl" })
        .sort({ createdAt: -1 })
        .limit(12);

    if (!courses) {
        return res.status(404).json({ message: "Course not found", success: false });
    }

    const stats = await getCourseRatingStats(courses.map((c) => c._id));
    const coursesWithRating = courses.map((c) => {
        const s = stats[c._id.toString()] || { rating: 0, reviewCount: 0 };
        return { ...c.toObject(), rating: s.rating, reviewCount: s.reviewCount };
    });

    await redis.set("trending_courses", JSON.stringify(coursesWithRating), "EX", 3600);

    return res.status(200).json({
        courses: coursesWithRating,
        success: true
    });
};

export const getCreatorCourses = async (req, res) => {
    try {
        const userId = req.id;
        const { page = 1, limit = 10 } = req.query;
        
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const skip = (pageNumber - 1) * limitNumber;

        const totalCourses = await Course.countDocuments({ creator: userId });
        const courses = await Course.find({ creator: userId }).skip(skip).limit(limitNumber).sort({ createdAt: -1 });
        
        if (!courses) {
            return res.status(404).json({ courses: [], message: "Course not found", success: false });
        }
        return res.status(200).json({
            courses,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalCourses / limitNumber),
            success: true
        });
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed to get creator courses"
        });
    }
};

export const editCourse = async (req, res) => {
    const courseId = req.params.courseId;
    const { title, subTitle, description, category, level, price } = req.body;
    const thumbnail = req.file;

    let course = await Course.findById(courseId);
    if (!course) {
        return res.status(404).json({
            message: "Course not found!",
            success: false
        });
    }

    let courseThumbnail;
    if (thumbnail) {
        if (course.thumbnail) {
            const publicId = course.thumbnail.split("/").pop().split(".")[0];
            await deleteMediaFromCloudinary(publicId);
        }
        courseThumbnail = await uploadMedia(thumbnail.path);
    }

    const updateData = {
        title,
        subTitle,
        description,
        category,
        level,
        price,
        thumbnail: courseThumbnail ? courseThumbnail.secure_url : course.thumbnail
    };

    course = await Course.findByIdAndUpdate(courseId, updateData, { new: true });

    return res.status(200).json({
        course,
        message: "Course updated successfully.",
        success: true
    });
};

export const getCourseById = async (req, res) => {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) {
        return res.status(404).json({
            message: "Course not found!",
            success: false
        });
    }
    return res.status(200).json({
        course,
        success: true
    });
};

export const createLecture = async (req, res) => {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;

    if (!lectureTitle || !courseId) {
        return res.status(400).json({
            message: "Lecture title is required",
            success: false
        });
    }

    const lecture = await Lecture.create({ lectureTitle });
    const course = await Course.findById(courseId);
    if (course) {
        course.lectures.push(lecture._id);
        await course.save();
    }

    return res.status(201).json({
        lecture,
        message: "Lecture created successfully.",
        success: true
    });
};

export const getCourseLecture = async (req, res) => {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate("lectures");
    if (!course) {
        return res.status(404).json({
            message: "Course not found",
            success: false
        });
    }
    return res.status(200).json({
        lectures: course.lectures,
        success: true
    });
};

export const editLecture = async (req, res) => {
    const { lectureTitle, videoInfo, isPreviewFree } = req.body;
    const { courseId, lectureId } = req.params;
    const videoFile = req.file;

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
        return res.status(404).json({
            message: "Lecture not found!",
            success: false
        });
    }

    if (lectureTitle) lecture.lectureTitle = lectureTitle;
    lecture.isPreviewFree = isPreviewFree === 'true' || isPreviewFree === true;

    if (videoFile) {
        if (lecture.publicId) {
            await deleteVideoFromCloudinary(lecture.publicId);
        }
        const uploadRes = await uploadMedia(videoFile.path);
        
        lecture.videoUrl = uploadRes.hlsUrl || uploadRes.secure_url;
        lecture.publicId = uploadRes.public_id;
    } 
    
    else if (videoInfo && typeof videoInfo === 'object') {
         if (videoInfo.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
         if (videoInfo.publicId) lecture.publicId = videoInfo.publicId;
    } else if (typeof videoInfo === 'string') {
         const parsed = JSON.parse(videoInfo);
         if (parsed.videoUrl) lecture.videoUrl = parsed.videoUrl;
         if (parsed.publicId) lecture.publicId = parsed.publicId;
    }

    await lecture.save();

    const course = await Course.findById(courseId);
    if (course && !course.lectures.includes(lecture._id)) {
        course.lectures.push(lecture._id);
        await course.save();
    }

    return res.status(200).json({
        lecture,
        message: "Lecture updated successfully.",
        success: true
    });
};

export const removeLecture = async (req, res) => {
    const { lectureId } = req.params;
    const lecture = await Lecture.findByIdAndDelete(lectureId);
    if (!lecture) {
        return res.status(404).json({
            message: "Lecture not found!",
            success: false
        });
    }
    if (lecture.publicId) {
        await deleteVideoFromCloudinary(lecture.publicId);
    }
    await Course.updateOne(
        { lectures: lectureId },
        { $pull: { lectures: lectureId } }
    );
    return res.status(200).json({
        message: "Lecture removed successfully.",
        success: true
    });
};

export const getLectureById = async (req, res) => {
    const { lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
        return res.status(404).json({
            message: "Lecture not found!",
            success: false
        });
    }
    return res.status(200).json({
        lecture,
        success: true
    });
};

export const togglePublishCourse = async (req, res) => {
    const { courseId } = req.params;
    const { publish } = req.query;

    const course = await Course.findById(courseId);
    if (!course) {
        return res.status(404).json({
            message: "Course not found!",
            success: false
        });
    }
    course.isPublished = publish === "true";
    await course.save();

    await redis.del("trending_courses");

    const statusMessage = course.isPublished ? "Published" : "Unpublished";
    return res.status(200).json({
        message: `Course is ${statusMessage}`,
        success: true
    });
};
