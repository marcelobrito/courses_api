import type { ICourse } from "../../contracts/entities/course";
import { Repository } from "./repository";

export class CourseRepository extends Repository<ICourse> {
	protected table = "courses";
}
