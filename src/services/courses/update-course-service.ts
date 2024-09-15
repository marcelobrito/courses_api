import type { ICourse } from "../../contracts/entities/course";
import type { IRepository } from "../../contracts/repository";
import type { GetUserService } from "./get-user-service";
import type { ValidateCourseService } from "./validate-course-service";

export class UpdateCourseService {
	constructor(
		private repository: IRepository<ICourse>,
		private validateCourseService: ValidateCourseService,
		private getUserService: GetUserService,
	) {}
	update(course: ICourse): ICourse {
		this.getUserService.get(course.id);
		this.validateCourseService.validate(course);
		return this.repository.update(course);
	}
}
