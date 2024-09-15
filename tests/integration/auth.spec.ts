import jwt from "jsonwebtoken";
import request, { type Response } from "supertest";
import app from "../../src/app";
import type { Token } from "../../src/contracts/entities/token";
import { LoginService } from "../../src/services/auth/LoginService";

const loginService = new LoginService();
const token: Token = loginService.login(
	process.env.LOGIN_USERNAME || "",
	process.env.LOGIN_PASSWORD || "",
);

describe("Auth Use case", () => {
	it("Should protect route", async () => {
		await request(app).get("/v1/courses").set("Authorization", "").expect(403);
	});

	it("Should validate token", async () => {
		const res: Response = await request(app)
			.get("/v1/courses")
			.set("Authorization", "invalid_token")
			.expect(401);

		expect(res.body).toStrictEqual({
			messages: ["Failed to authenticate token."],
		});
	});

	it("Should check if token expired", async () => {
		const sleep = (ms: number) => {
			return new Promise((resolve) => setTimeout(resolve, ms));
		};

		const tokenToExpire: string = jwt.sign(
			{ username: process.env.LOGIN_USERNAME },
			process.env.SECRET || "",
			{ expiresIn: 1 },
		);
		await sleep(1000);

		const res: Response = await request(app)
			.get("/v1/courses")
			.set("Authorization", tokenToExpire)
			.expect(401);

		expect(res.body).toStrictEqual({
			messages: ["Expired token."],
		});
	});

	it("Should return error if credentials are invalid", async () => {
		const res: Response = await request(app)
			.post("/v1/login")
			.set("Authorization", token.token)
			.send({
				username: "invalid_user",
				password: "invalid_password",
			})
			.expect(422);

		expect(res.body).toStrictEqual({
			messages: ["Invalid credentials"],
		});
	});

	it("Should login", async () => {
		const res: Response = await request(app)
			.post("/v1/login")
			.set("Authorization", token.token)
			.send({
				username: process.env.LOGIN_USERNAME,
				password: process.env.LOGIN_PASSWORD,
			})
			.expect(200);

		expect(Object.keys(res.body)).toStrictEqual(["token"]);
	});
});
