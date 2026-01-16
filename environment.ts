export function token() {
	const token = process.env.BOT_TOKEN;
	if (token === undefined) {
		console.log(
			"Missing discord bot token. Did you made sure to create a .env and include all needed fields?",
		);
		process.exit(1);
	}
	return token;
}
