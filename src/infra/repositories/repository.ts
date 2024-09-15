import type { StatementSync } from "node:sqlite";
import type { IRepository } from "../../contracts/repository";
import { databaseSync } from "../db";

export abstract class Repository<T> implements IRepository<T> {
	protected table = "table_name";

	getById(id: string): T | null {
		const query: StatementSync = databaseSync.prepare(
			`select * from ${this.table} where id = ?`,
		);
		return (query.get(id) as T) || null;
	}

	getAll(filter?: object): T[] | null {
		let sql = `select * from ${this.table}`;
		const criteria: Array<string> = [];
		const namedParameters: { [key: string]: string | number } = {};

		const filterKeys = Object.keys(filter || {});

		for (const property of filterKeys) {
			const value = (filter as object)[property as keyof typeof filter];
			if (!value) {
				continue;
			}

			if (typeof value === "string") {
				criteria.push(`${property} like :${property} ESCAPE '\\'`);
				namedParameters[`:${property}`] =
					`%${(value as string).replace(/%/g, "\\%")}%`;
			} else if (typeof value === "number") {
				criteria.push(`${property} = :${property}`);
				namedParameters[`:${property}`] = value;
			}
		}

		if (criteria.length) {
			sql += ` where ${criteria.join(" and ")} `;
		}

		const query: StatementSync = databaseSync.prepare(sql);

		return (query.all(namedParameters) as T[]) || null;
	}

	create(element: T): T {
		const keys: string[] = Object.keys(element as object);

		const insert: StatementSync = databaseSync.prepare(`insert into courses 
            (${keys.join(",")}) 
            values (${keys.map((e) => "?").join(",")})`);

		insert.run(...Object.values(element as object));

		return element;
	}
	update(element: T): T {
		const id: string = element["id" as keyof typeof element] as string;
		const clone = { ...element };
		delete clone["id" as keyof typeof element];

		const update: StatementSync = databaseSync.prepare(`update courses set 
            ${Object.keys(clone as object)
							.map((e) => `${e} = ?`)
							.join(",")} where id = ?`);

		const res = update.run(...Object.values(clone as object), id);

		return element;
	}
	delete(id: string): void {
		const insert: StatementSync = databaseSync.prepare(
			"delete from courses where id = ?",
		);
		insert.run(id);
	}
}
