import express, { type Router } from "express";
import { CoursesController } from "../../controllers/courses-controller";

const router: Router = express.Router();

router.route("/").post(CoursesController.create).get(CoursesController.getAll);

router
	.route("/:id")
	.put(CoursesController.update)
	.get(CoursesController.getById)
	.delete(CoursesController.delete);

export default router;
