import type { Server } from "node:http";
import app from "./app";

const server: Server = app.listen(3000);

const unexpectedErrorHandler = (error: unknown) => {
	console.error(error);
	if (server) {
		server.close(() => {
			console.info("Server closed");
			process.exit(1);
		});
	} else {
		process.exit(1);
	}
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
