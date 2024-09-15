import type { ICourse } from "../../contracts/entities/course";
import type { IRepository } from "../../contracts/repository";
import { NotFoundError } from "../../errors/not-found-error";

export class GetUserService {
	constructor(private repository: IRepository<ICourse>) {}
	get(id: string): ICourse {
		const course: ICourse | null = this.repository.getById(id);
		if (course === null)
			throw new NotFoundError(`Course with id ${id} not found`);

		return course;
	}
}
