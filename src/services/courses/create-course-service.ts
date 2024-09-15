import type { ICourse } from "../../contracts/entities/course";
import type { IRepository } from "../../contracts/repository";
import type { ValidateCourseService } from "./validate-course-service";

export class CreateCourseService {
	constructor(
		private repository: IRepository<ICourse>,
		private validateCourseService: ValidateCourseService,
	) {}
	create(course: ICourse): ICourse {
		this.validateCourseService.validate(course);
		return this.repository.create(course);
	}
}
