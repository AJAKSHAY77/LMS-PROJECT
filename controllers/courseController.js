import Course from "../Models/course.model.js"

export const getAllCourse = async function(req,res,next){

    try {
         const course = Course.find({}).select("-lectures");

         res.status(200).json({
           success: true,
           message: "all courses",
           course,
         });
    } catch (e) {
    return next(new AppError(e.message, 500));
        
    }

     
   
}

export const getLecturesByCourseId = async function(req,res,next) {
    
}