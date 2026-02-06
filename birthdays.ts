import { ChannelType } from "discord.js";
import { client } from "./client";
import { Birthday, Settings } from "./db";

export async function setupBirthdayIntervals() {
	const EVERY_HOUR = 60 * 60 * 1000;
	await runBirthdayCheckForAllGuilds();
	setInterval(async () => {
		await runBirthdayCheckForAllGuilds();
	}, EVERY_HOUR);
}

async function runBirthdayCheckByGuild(guildId: string) {
	const guild = await client.guilds.fetch(guildId).catch(() => null);
	if (guild === null) return;
	const settings = await Settings.getByGuild(guild.id);
	if (settings === null) return;
	if (
		settings.birthdayRoleId === undefined &&
		settings.birthdayChannelId === undefined
	)
		return;
	const role = settings.birthdayRoleId
		? await guild.roles.fetch(settings.birthdayRoleId).catch(() => null)
		: null;
	const todaysBirthdays = await Birthday.todaysBirthdays(guildId);
	for (const birthday of todaysBirthdays) {
		if (birthday.lastCelebratedYear === new Date().getFullYear()) continue;
		const member = await guild.members.fetch(birthday.userId).catch(() => null);
		if (role) {
			if (member === null) continue;
			await member.roles.add(role).catch(() => null);
		}
		const channel = settings.birthdayChannelId
			? await guild.channels.fetch(settings.birthdayChannelId)
			: null;
		if (channel && channel.type === ChannelType.GuildText && member) {
			await channel.send(`Happy birthday to ${member}!`).catch(() => null);
		}
		await Birthday.updateLastCelebratedYear(birthday._id);
	}
	if (role === null) return;
	for (const member of role.members.values()) {
		const birthday = todaysBirthdays.find(
			(birthday) => birthday.userId === member.user.id,
		);
		if (birthday === undefined)
			await member.roles.remove(role.id).catch(() => null);
	}
}

async function runBirthdayCheckForAllGuilds() {
	console.log("Running birthday checks...");
	for (const guild of client.guilds.cache.values()) {
		const settings = await Settings.getByGuild(guild.id);
		if (settings === null) continue;
		await runBirthdayCheckByGuild(settings.guildId);
	}
	console.log("Finished running birthday checks.");
}
