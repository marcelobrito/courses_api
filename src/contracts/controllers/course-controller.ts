import type { Request, Response } from "express";

export interface ICoursesController {
	create: (req: Request, res: Response) => void;
	update: (req: Request, res: Response) => void;
	delete: (req: Request, res: Response) => void;
	getById: (req: Request, res: Response) => void;
	getAll: (req: Request, res: Response) => void;
}
