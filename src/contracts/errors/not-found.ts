import type { NextFunction, Request, Response } from "express";

export type NotFound = (
	req: Request,
	res: Response,
	next: NextFunction,
) => void;
