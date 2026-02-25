import { isDevEnvironment } from "./consts";

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
	return isDevEnvironment ? "1461519620660924543" : "1369433346546991136";
}

export function convexUrl() {
	const convexUrl = process.env.CONVEX_URL;
	if (convexUrl === undefined) warnAndCrash("convex url");
	return convexUrl;
}

export function apiPort() {
	const apiPort = process.env.API_PORT;
	if (apiPort === undefined) warnAndCrash("api port");
	return apiPort;
}

export function jwtSecret() {
	const jwtSecret = process.env.JWT_SECRET;
	if (jwtSecret === undefined) warnAndCrash("jwt secret");
	return new TextEncoder().encode(jwtSecret);
}

function warnAndCrash(field: string): never {
	console.error(
		`Missing ${field}. Did you made sure to create a .env and populate all needed fields?`,
	);
	process.exit(1);
}
