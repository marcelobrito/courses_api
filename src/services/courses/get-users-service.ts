import z, {
	type SafeParseReturnType,
	type ZodObject,
	type ZodRawShape,
} from "zod";
import type { ICourse } from "../../contracts/entities/course";
import type { Filter } from "../../contracts/entities/filter";
import type { IRepository } from "../../contracts/repository";
import { ValidationError } from "../../errors";

export class GetUsersService {
	constructor(private repository: IRepository<ICourse>) {}
	getAll(filter?: Filter): ICourse[] | null {
		const finalFilter = {
			...filter,
			duration: this.handleDuration(filter?.duration),
		};
		this.validateFilter(finalFilter);
		return this.repository.getAll(finalFilter);
	}
	handleDuration(duration?: string | number) {
		const durationIsNotEmptyAndIsNumber =
			duration !== undefined &&
			duration !== "" &&
			Number.isFinite(Number.parseInt(duration as string));

		let durationValue = durationIsNotEmptyAndIsNumber
			? Number.parseInt(duration as string)
			: duration;

		if (durationValue === "") durationValue = undefined;
		return durationValue;
	}

	validateFilter(filter: Filter) {
		const object: ZodObject<ZodRawShape> = z.object({
			title: z
				.string({
					invalid_type_error: "Expected title to be text",
				})
				.max(250, "title must have no more than 250 characters")
				.optional(),
			description: z
				.string({
					invalid_type_error: "Expected description to be text",
				})
				.max(2000, "description must have no more than 2000 characters")
				.optional(),
			duration: z
				.number({
					invalid_type_error: "Expected duration to be number",
				})
				.min(1, "duration must be greater than or equal to 1")
				.max(86400, "duration must be less than or equal to 86400")
				.optional(),
			instructor: z
				.string({
					invalid_type_error: "Expected instructor to be text",
				})
				.max(250, "instructor must have no more than 250 characters")
				.optional(),
		});

		const parsedData: SafeParseReturnType<unknown, unknown> =
			object.safeParse(filter);

		if (parsedData.error?.errors)
			throw new ValidationError(parsedData.error?.errors.map((e) => e.message));
	}
}
