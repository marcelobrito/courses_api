import request, { type Response } from "supertest";
import app from "../../src/app";
import type { ICourse } from "../../src/contracts/entities/course";
import type { Token } from "../../src/contracts/entities/token";
import { databaseSync, migrateDb } from "../../src/infra/db";
import { LoginService } from "../../src/services/auth/LoginService";

const generateString = (length: number, char = "a") =>
	Array.from({ length }, (_) => char).join("");

const loginService = new LoginService();
const token: Token = loginService.login(
	process.env.LOGIN_USERNAME || "",
	process.env.LOGIN_PASSWORD || "",
);

migrateDb();

describe("Courses Use cases", () => {
	beforeEach(() => {
		databaseSync.exec("drop table if exists courses");
		migrateDb();
	});

	it("Should validate required inputs", async () => {
		const res: Response = await request(app)
			.post("/v1/courses")
			.set("Authorization", token.token)
			.send({})
			.expect(422);

		expect(res.body).toStrictEqual({
			messages: [
				"title is required",
				"description is required",
				"duration is required",
				"instructor is required",
			],
		});
	});

	it("Should validate course parameters types", async () => {
		const course: object = {
			title: 2,
			description: 3,
			duration: "duration",
			instructor: 4,
		};

		const res: Response = await request(app)
			.post("/v1/courses")
			.set("Authorization", token.token)
			.send(course)
			.expect(422);

		expect(res.body).toStrictEqual({
			messages: [
				"Expected title to be text",
				"Expected description to be text",
				"Expected duration to be number",
				"Expected instructor to be text",
			],
		});
	});

	it("Should validate inputs length", async () => {
		const course: Partial<ICourse> = {
			title: generateString(251),
			description: generateString(2001),
			duration: 86401,
			instructor: generateString(251),
		};

		const res: Response = await request(app)
			.post("/v1/courses")
			.set("Authorization", token.token)
			.send(course)
			.expect(422);

		expect(res.body).toStrictEqual({
			messages: [
				"title must have no more than 250 characters",
				"description must have no more than 2000 characters",
				"duration must be less than or equal to 86400",
				"instructor must have no more than 250 characters",
			],
		});
	});

	it("Shoud create Course", async () => {
		const course: Partial<ICourse> = {
			title: generateString(10),
			description: generateString(10),
			duration: 86400,
			instructor: generateString(10),
		};

		const res: Response = await request(app)
			.post("/v1/courses")
			.set("Authorization", token.token)
			.send(course)
			.expect(201);

		const { id: _, ...insertedCourse } = res.body;

		expect(insertedCourse).toStrictEqual(course);
	});

	it("Shoud update Course", async () => {
		const course: Partial<ICourse> = {
			title: generateString(10),
			description: generateString(10),
			duration: 86400,
			instructor: generateString(10),
		};

		const res: Response = await request(app)
			.post("/v1/courses")
			.set("Authorization", token.token)
			.send(course)
			.expect(201);

		const courseId: string = res.body.id;

		const courseUpdated: Partial<ICourse> = {
			title: generateString(10, "b"),
			description: generateString(10, "b"),
			duration: 86300,
			instructor: generateString(10, "b"),
		};

		const updateResponse: Response = await request(app)
			.put(`/v1/courses/${courseId}`)
			.set("Authorization", token.token)
			.send(courseUpdated)
			.expect(200);

		expect(updateResponse.body).toStrictEqual({
			...courseUpdated,
			id: courseId,
		});
	});

	it("Shoud delete Course", async () => {
		const course: Partial<ICourse> = {
			title: generateString(10),
			description: generateString(10),
			duration: 86400,
			instructor: generateString(10),
		};

		const res: Response = await request(app)
			.post("/v1/courses")
			.set("Authorization", token.token)
			.send(course)
			.expect(201);

		const courseId: string = res.body.id;

		await request(app)
			.delete(`/v1/courses/${courseId}`)
			.set("Authorization", token.token)
			.expect(200);

		await request(app)
			.get(`/v1/courses/${courseId}`)
			.set("Authorization", token.token)
			.expect(404);
	});

	it("Should return 404 status code for invalid get course id", async () => {
		await request(app)
			.get("/v1/courses/invalid_id")
			.set("Authorization", token.token)
			.expect(404);
	});

	it("Shoud get Course by id", async () => {
		const course: Partial<ICourse> = {
			title: generateString(10),
			description: generateString(10),
			duration: 86400,
			instructor: generateString(10),
		};

		const res: Response = await request(app)
			.post("/v1/courses")
			.set("Authorization", token.token)
			.send(course)
			.expect(201);

		const courseId: string = res.body.id;

		const getByIdResponse: Response = await request(app)
			.get(`/v1/courses/${courseId}`)
			.set("Authorization", token.token)
			.expect(200);

		expect(getByIdResponse.body).toStrictEqual({
			...course,
			id: courseId,
		});
	});

	it("Shoud get Courses", async () => {
		const courseA: Omit<ICourse, "id"> = {
			title: generateString(10),
			description: generateString(10),
			duration: 86400,
			instructor: generateString(10),
		};

		const courseB: Omit<ICourse, "id"> = {
			title: generateString(10, "b"),
			description: generateString(11, "b"),
			duration: 86300,
			instructor: generateString(12, "b"),
		};

		const resCourseA: Response = await request(app)
			.post("/v1/courses")
			.set("Authorization", token.token)
			.send(courseA)
			.expect(201);

		const resCourseB: Response = await request(app)
			.post("/v1/courses")
			.set("Authorization", token.token)
			.send(courseB)
			.expect(201);

		const courseAId: string = resCourseA.body.id;
		const courseBId: string = resCourseB.body.id;

		const coursesResponse: Response = await request(app)
			.get("/v1/courses")
			.set("Authorization", token.token)
			.expect(200);

		expect(coursesResponse.body).toStrictEqual([
			{ ...courseA, id: courseAId },
			{ ...courseB, id: courseBId },
		]);
	});

	it("Shoud get Courses with multiple filters", async () => {
		const courseA: Omit<ICourse, "id"> = {
			title: generateString(10),
			description: generateString(10),
			duration: 86400,
			instructor: generateString(10),
		};

		const courseB: Omit<ICourse, "id"> = {
			title: generateString(10, "b"),
			description: generateString(11, "b"),
			duration: 86300,
			instructor: generateString(12, "b"),
		};

		const resCourseA: Response = await request(app)
			.post("/v1/courses")
			.set("Authorization", token.token)
			.send(courseA)
			.expect(201);

		const resCourseB: Response = await request(app)
			.post("/v1/courses")
			.set("Authorization", token.token)
			.send(courseB)
			.expect(201);

		const courseAId: string = resCourseA.body.id;
		const courseBId: string = resCourseB.body.id;

		const coursesResponse: Response = await request(app)
			.get(
				`/v1/courses?title=${courseB.title}&description=${courseB.description}&duration=${courseB.duration}&instructor=${courseB.instructor}`,
			)
			.set("Authorization", token.token)
			.expect(200);

		expect(coursesResponse.body).toStrictEqual([{ ...courseB, id: courseBId }]);
	});

	it("Should validate get courses parameters", async () => {
		const course: Partial<ICourse> = {
			title: generateString(251),
			description: generateString(2001),
			duration: 86401,
			instructor: generateString(251),
		};

		const res: Response = await request(app)
			.get(
				`/v1/courses?title=${course.title}&description=${course.description}&duration=${course.duration}&instructor=${course.instructor}`,
			)
			.set("Authorization", token.token)
			.expect(422);

		expect(res.body).toStrictEqual({
			messages: [
				"title must have no more than 250 characters",
				"description must have no more than 2000 characters",
				"duration must be less than or equal to 86400",
				"instructor must have no more than 250 characters",
			],
		});
	});

	const filtersToApply: Array<[string, string]> = [
		["title", generateString(10, "b")],
		["description", generateString(11, "b")],
		["duration", "86300"],
		["instructor", generateString(12, "b")],
	];

	test.each(filtersToApply)(
		"Shoud get Courses with optional filter %s",
		async (input: string, value: string) => {
			const course: Omit<ICourse, "id"> = {
				title: generateString(10, "b"),
				description: generateString(11, "b"),
				duration: 86300,
				instructor: generateString(12, "b"),
			};
			const res: Response = await request(app)
				.post("/v1/courses")
				.set("Authorization", token.token)
				.send(course)
				.expect(201);

			const filterResponse: Response = await request(app)
				.get(`/v1/courses?${input}=${value}`)
				.set("Authorization", token.token)
				.expect(200);

			expect(filterResponse.body).toStrictEqual([
				{ ...course, id: res.body.id },
			]);
		},
	);
});
