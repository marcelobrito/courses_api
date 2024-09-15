import express, { type Router } from "express";
import { AuthController } from "../../controllers/auth-controller";
import { verifyToken } from "../../middlewares/check-token";
import coursesRoute from "./courses";

const router = express.Router();

router.post("/login", AuthController.login);
router.use("/courses", verifyToken, coursesRoute);
export default router;
