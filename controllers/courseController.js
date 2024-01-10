import Course from "../Models/course.model.js";
import AppError from "../utils/error.utils.js";
import cloudinary from "cloudinary";
import fs from  "fs/promises";

export const getAllCourse = async function (req, res, next) {
  try {
    const course = await Course.find({}).select("-lectures");

    res.status(200).json({
      success: true,
      message: "all courses",
      course,
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};

export const getLecturesByCourseId = async function (req, res, next) {
  try {
    const { id } = req.params;
    console.log(id);
    const course = await Course.findById(id);
    console.log(course);

    if (!course) {
      return next(new AppError("Course not found", 400));
    }
    res.status(200).json({
      success: true,
      message: "Course lectures fetch successfully",
      lectures: course.lectures,
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};

export const createCourse = async (req, res, next) => {
  const { title, description, category, createdBy } = req.body;

  if (!title || !description || !category || !createdBy) {
    return next(new AppError("All field are required", 400));
  }

  const course = await Course.create({
    title,
    description,
    category,
    createdBy,
    thumbnail: {
      public_id: "xyz",
      secure_url: "abc",
    },
  });
  console.log(course);

  if (!course) {
    return next(
      new AppError("course could not be created ,please try again", 500)
    );
  }
  console.log(course);

  if (req.file) {
    try {
      const uploadImage = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms",
        // width: 200,
        // height: 200,
        // gravity: "faces",
        // crop: "fill",
      });
      // if image is uploaded successfull then
      if (uploadImage) {
        course.thumbnail.public_id = uploadImage.public_id;
        course.thumbnail.secure_url = uploadImage.secure_url;
      }

     
        fs.rm(`uploads/${req.file.filename}`);

    } catch (error) {
      return next(new AppError(error.message, 500));
    }
  }

  await course.save();
  res.json({
    success: true,
    message: "course created successfully",
    course,
  });
};

export const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },

      {
        runValidators: true,
      }
    );

    if (!course) {
      return next(new AppError("course with given ID is not exist", 500));
    }

    res.status(200).json({
      success: true,
      message: `cousre updated successfully`,
      course,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

export const Removecourse = async (req,res,next) => {

  try {
    const { id } = req.params
    
    const course = await Course.findById(id);
    
    if (!course) {
      return next(new AppError("course with given id dose not exist", 500));
      
    }

    await Course.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message:`cousre deleted successfully`
    })

    
  } catch (error) {
      return next(new AppError(error.message, 500));
    
  }
};

export const addLecturesByCourseId = async (req, res, next) => {

  const { title, description } = req.body;
  const { id } = req.params;

  let lectureData = {
    title,
    description,
  };

  if (!title || !description) {
    return next(new AppError("Title and Description are required", 400));
  }

  const course = await Course.findById(id);

  if (!course) {
    return next(new AppError('Invalid course id or course not found.', 400));
  }

  // Run only if user sends a file
  if (req.file) {
    try {
      const uploadImage = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms",
        width: 200,
        height: 200,
        gravity: "faces",
        crop: "fill",
      });
      // if image is uploaded successfull then
      if (uploadImage) {
        lectureData.thumbnail.public_id = uploadImage.public_id;
        course.thumbnail.secure_url = uploadImage.secure_url;
      }

      fs.rm(`uploads/${req.file.filename}`);
    } catch (error) {
      return next(new AppError(error.message, 500));
    }
  }
  course.lectures.push(lectureData)
      course.numberOfLectures  = course.lectures.length
    await course.save()


}
