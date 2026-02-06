import type { Client } from "discord.js";
import { setupBirthdayIntervals } from "../birthdays";
import { registerTempRoleTimeouts } from "../tempRolesHandler";

export default async (client: Client<true>) => {
	console.log(`Logged in as ${client.user.tag}!`);
	await registerTempRoleTimeouts();
	await setupBirthdayIntervals();
};
