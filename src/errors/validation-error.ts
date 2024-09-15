export class ValidationError extends Error {
	public messages: string[];
	constructor(messages: string[], message?: string, options?: ErrorOptions) {
		super(message, options);
		this.messages = messages;
	}
}
