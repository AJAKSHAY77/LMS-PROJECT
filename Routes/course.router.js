import { Router } from "express";
import { Removecourse, addLecturesByCourseId, createCourse, getAllCourse, getLecturesByCourseId, updateCourse } from "../controllers/courseController.js";
import { authorizeRoles, isLoggedIn } from "../Middleware/authmiddleware.js";
import upload from "../Middleware/mutler.middleware.js";

const courseRouter = Router();

courseRouter
  .route("/")
  .get(getAllCourse)
  .post(
    isLoggedIn,
    authorizeRoles("ADMIN"),
    upload.single("thumbnail"),
    createCourse
  );             
    
courseRouter
  .route("/:id")
  .get(isLoggedIn, getLecturesByCourseId)
  .put(isLoggedIn, authorizeRoles("ADMIN"), updateCourse)
  .delete(isLoggedIn, authorizeRoles("ADMIN"), Removecourse)
  .post(isLoggedIn, authorizeRoles("ADMIN"),upload.single("lectures"), addLecturesByCourseId);

export default courseRouter;

