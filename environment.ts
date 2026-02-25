import { isDevEnvironment } from "./consts";

export function token() {
	const token = process.env.BOT_TOKEN;
	if (token === undefined) warnAndCrash("token");
	return token;
}

export function clientId() {
	return isDevEnvironment ? "1476017873729228871" : "1461518757015851111";
}

export function guildId() {
	return isDevEnvironment ? "1461519620660924543" : "1369433346546991136";
}

function warnAndCrash(field: string): never {
	console.error(
		`Missing ${field}. Did you made sure to create a .env and populate all needed fields?`,
	);
	process.exit(1);
}
