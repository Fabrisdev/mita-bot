export function token() {
	const token = process.env.BOT_TOKEN;
	if (token === undefined) warnAndCrash("token");
	return token;
}

function warnAndCrash(field: string): never {
	console.error(
		`Missing ${field}. Did you made sure to create a .env and populate all needed fields?`,
	);
	process.exit(1);
}
