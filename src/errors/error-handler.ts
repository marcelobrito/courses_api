import type { NextFunction, Request, Response } from "express";
import { NotFoundError, ValidationError } from ".";
import type { ErrorHandler as ErrorHandlerType } from "../contracts/errors/error-handler";

export const ErrorHandler: ErrorHandlerType = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	if (err instanceof ValidationError)
		res.status(422).send({ messages: err.messages });
	else if (err instanceof NotFoundError) res.status(404).send();
	else {
		console.error(err);
		res.status(500).send({ message: "Something broke!" });
	}
};
