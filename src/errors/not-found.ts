import type { NextFunction, Request, Response } from "express";
import type { NotFound as NotFoundType } from "../contracts/errors/not-found";

export const NotFound: NotFoundType = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	res.status(404).send();
	next();
};
