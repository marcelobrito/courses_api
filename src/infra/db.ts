import { DatabaseSync } from "node:sqlite";

export const databaseSync: DatabaseSync = new DatabaseSync(":memory:");

export const migrateDb = (): void => {
	try {
		databaseSync.exec(
			"create table if not exists courses (id TEXT primary key, title TEXT, description TEXT, duration INTEGER, instructor TEXT)",
		);
	} catch (error) {
		throw new Error("Could not migrate database", { cause: error });
	}
};
