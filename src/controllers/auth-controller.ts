import type { Request, Response } from "express";
import type { IAuthController } from "../contracts/controllers/auth-controller";
import type { Token } from "../contracts/entities/token";
import { LoginService } from "../services/auth/LoginService";

export const AuthController: IAuthController = {
	login: (req: Request, res: Response): void => {
		const service: LoginService = new LoginService();
		const token: Token = service.login(req.body.username, req.body.password);
		res.json(token);
	},
};
