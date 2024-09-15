import jwt from "jsonwebtoken";
import type { Token } from "../../contracts/entities/token";
import { ValidationError } from "../../errors";

export class LoginService {
	login(username: string, password: string): Token {
		if (
			username === process.env.LOGIN_USERNAME &&
			password === process.env.LOGIN_PASSWORD
		) {
			return {
				token: jwt.sign({ username }, process.env.SECRET || "", {
					expiresIn: 300,
				}),
			};
		}

		throw new ValidationError(["Invalid credentials"]);
	}
}
