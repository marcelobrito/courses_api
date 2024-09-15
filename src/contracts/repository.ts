export interface IRepository<T> {
	getById(id: string): T | null;
	getAll(filter?: object): T[] | null;
	create(element: T): T;
	update(element: T): T;
	delete(id: string): void;
}
