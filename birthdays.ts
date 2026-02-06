import { client } from "./client";
import { Birthday, Settings } from "./db";

export async function setupBirthdayIntervals() {
	console.log("Setting up birthday intervals...");
	const EVERY_DAY = 24 * 60 * 60 * 1000;
	setInterval(async () => {
		for (const guild of client.guilds.cache.values()) {
			const settings = await Settings.getByGuild(guild.id);
			if (settings === null) continue;
			await runBirthdayCheckByGuild(settings.guildId);
		}
	}, EVERY_DAY);
	console.log("Finished setting up birthday intervals");
}

async function runBirthdayCheckByGuild(guildId: string) {
	const guild = await client.guilds.fetch(guildId).catch(() => null);
	if (guild === null) return;
	const settings = await Settings.getByGuild(guild.id);
	if (settings === null) return;
	if (settings.birthdayRoleId === undefined) return;
	const role = await guild.roles
		.fetch(settings.birthdayRoleId)
		.catch(() => null);
	if (role === null) return;
	const todaysBirthdays = await Birthday.todaysBirthdays(guildId);
	for (const birthday of todaysBirthdays) {
		if (birthday.lastCelebratedYear === new Date().getFullYear()) continue;
		const member = await guild.members.fetch(birthday.userId).catch(() => null);
		if (member === null) continue;
		await member.roles.add(role).catch(() => null);
		await Birthday.updateLastCelebratedYear(birthday._id);
	}
}
