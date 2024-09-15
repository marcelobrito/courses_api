import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const token: string = req.header("Authorization") || "";
	if (!token) return res.status(403).send();
	jwt.verify(token, process.env.SECRET || "", (err, decoded) => {
		if (err) {
			const json: { exp: number } = jwt.decode(token) as { exp: number };
			if (
				typeof json === "object" &&
				json?.exp <= Math.floor(Date.now() / 1000)
			)
				return res.status(401).json({ messages: ["Expired token."] });

			return res
				.status(401)
				.json({ messages: ["Failed to authenticate token."] });
		}
		next();
	});
};
