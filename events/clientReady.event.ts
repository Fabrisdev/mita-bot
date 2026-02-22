import type { Client } from "discord.js";
import { setupBirthdayIntervals } from "../birthdays";
import { publishRedditPosts } from "../reddit";
import { registerTempRoleTimeouts } from "../tempRolesHandler";

export default async (client: Client<true>) => {
	console.log(`Logged in as ${client.user.tag}!`);
	await registerTempRoleTimeouts();
	await setupBirthdayIntervals();
	const TWELVE_HOURS = 12 * 60 * 60 * 1000;
	setInterval(publishRedditPosts, TWELVE_HOURS);
	await publishRedditPosts();
};
