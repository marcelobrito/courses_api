import { randomUUID } from "node:crypto";
import type { Request, Response } from "express";
import type { ICoursesController } from "../contracts/controllers/course-controller";
import type { ICourse } from "../contracts/entities/course";
import { CourseRepository } from "../infra/repositories/course-repository";
import { CreateCourseService } from "../services/courses/create-course-service";
import { DeleteCourseService } from "../services/courses/delete-course-service";
import { GetUserService } from "../services/courses/get-user-service";
import { GetUsersService } from "../services/courses/get-users-service";
import { UpdateCourseService } from "../services/courses/update-course-service";
import { ValidateCourseService } from "../services/courses/validate-course-service";

export const CoursesController: ICoursesController = {
	create: (req: Request, res: Response) => {
		const service: CreateCourseService = new CreateCourseService(
			new CourseRepository(),
			new ValidateCourseService(),
		);
		const course: ICourse = service.create({
			id: randomUUID(),
			title: req.body.title,
			description: req.body.description,
			duration: req.body.duration as number,
			instructor: req.body.instructor,
		});
		res.status(201).send(course);
	},
	update: (req: Request, res: Response) => {
		const service: UpdateCourseService = new UpdateCourseService(
			new CourseRepository(),
			new ValidateCourseService(),
			new GetUserService(new CourseRepository()),
		);
		const course: ICourse = service.update({
			id: req.params.id,
			title: req.body.title,
			description: req.body.description,
			duration: req.body.duration as number,
			instructor: req.body.instructor,
		});
		res.status(200).send(course);
	},
	delete: (req: Request, res: Response) => {
		const service: DeleteCourseService = new DeleteCourseService(
			new CourseRepository(),
			new GetUserService(new CourseRepository()),
		);
		service.delete(req.params.id);

		res.status(200).send();
	},

	getById: (req: Request, res: Response) => {
		const service: GetUserService = new GetUserService(new CourseRepository());
		const course: ICourse = service.get(req.params.id);
		res.status(200).send(course);
	},

	getAll: (req: Request, res: Response) => {
		const service: GetUsersService = new GetUsersService(
			new CourseRepository(),
		);

		const courses: ICourse[] | null = service.getAll({
			title: req.query.title?.toString() as string,
			description: req.query.description as string,
			duration: req.query.duration as string,
			instructor: req.query.instructor as string,
		});
		res.status(200).send(courses);
	},
};
