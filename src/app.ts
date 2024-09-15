import path from "node:path";
import cors from "cors";
import express, { type Express } from "express";
import rateLimit, { type RateLimitRequestHandler } from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { ErrorHandler } from "./errors/error-handler";
import { NotFound } from "./errors/not-found";
import { migrateDb } from "./infra/db";
import routes from "./routes/v1";

try {
	migrateDb();
} catch (error) {
	console.error(error);
	process.exit(1);
}

const app: Express = express();

app.use(express.json());

const limiter: RateLimitRequestHandler = rateLimit({
	windowMs: 60 * 1000,
	max: 60,
});

app.use(limiter);
app.use(cors());
app.options("*", cors());

app.use("/v1", routes);
const swaggerDocument = YAML.load(`${path.resolve("./")}/swagger.yaml`);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(NotFound);

app.use(ErrorHandler);

export default app;
