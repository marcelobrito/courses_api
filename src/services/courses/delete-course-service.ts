import type { ICourse } from "../../contracts/entities/course";
import type { IRepository } from "../../contracts/repository";
import type { GetUserService } from "./get-user-service";

export class DeleteCourseService {
	constructor(
		private repository: IRepository<ICourse>,
		private getUserService: GetUserService,
	) {}
	delete(id: string): void {
		this.getUserService.get(id);
		this.repository.delete(id);
	}
}
