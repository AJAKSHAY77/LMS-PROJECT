import { Router } from "express";
import { getAllCourse, getLecturesByCourseId } from "../controllers/courseController.js";

const courseRouter = Router();

courseRouter.route("/")
                  .get(getAllCourse);

courseRouter.route("/:id") 
                .get(getLecturesByCourseId)

export default courseRouter;

