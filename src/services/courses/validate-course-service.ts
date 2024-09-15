import z, {
	type SafeParseReturnType,
	type ZodObject,
	type ZodRawShape,
} from "zod";
import type { ICourse } from "../../contracts/entities/course";
import { ValidationError } from "../../errors/validation-error";

export class ValidateCourseService {
	validate(course: ICourse) {
		const object: ZodObject<ZodRawShape> = z.object({
			id: z
				.string({
					required_error: "Id is required",
					invalid_type_error: "Expected id to be text",
				})
				.length(36, "id must contain 36 characters"),
			title: z
				.string({
					required_error: "title is required",
					invalid_type_error: "Expected title to be text",
				})
				.max(250, "title must have no more than 250 characters"),
			description: z
				.string({
					required_error: "description is required",
					invalid_type_error: "Expected description to be text",
				})
				.max(2000, "description must have no more than 2000 characters"),
			duration: z
				.number({
					required_error: "duration is required",
					invalid_type_error: "Expected duration to be number",
				})
				.max(86400, "duration must be less than or equal to 86400"),
			instructor: z
				.string({
					required_error: "instructor is required",
					invalid_type_error: "Expected instructor to be text",
				})
				.max(250, "instructor must have no more than 250 characters"),
		});

		const parsedData: SafeParseReturnType<unknown, unknown> =
			object.safeParse(course);

		if (parsedData.error?.errors)
			throw new ValidationError(parsedData.error?.errors.map((e) => e.message));
	}
}
