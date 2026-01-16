export function token() {
	const token = process.env.BOT_TOKEN;
	if (token === undefined) warnAndCrash("token");
	return token;
}

export function clientId() {
	const clientId = process.env.CLIENT_ID;
	if (clientId === undefined) warnAndCrash("client id");
	return clientId;
}

export function guildId() {
	const guildId = process.env.GUILD_ID;
	if (guildId === undefined) warnAndCrash("guild id");
	return guildId;
}

function warnAndCrash(field: string): never {
	console.error(
		`Missing ${field}. Did you made sure to create a .env and populate all needed fields?`,
	);
	process.exit(1);
}
