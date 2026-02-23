import { ChannelType } from "discord.js";
import { client } from "./client";
import { Birthday } from "./database/birthday";

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
	const role = settings.birthday_role_id
		? await guild.roles.fetch(settings.birthday_role_id).catch(() => null)
		: null;
	const todaysBirthdays = await Birthday.todaysBirthdays();
	for (const birthday of todaysBirthdays) {
		if (birthday.last_celebrated_year === new Date().getFullYear()) continue;
		const member = await guild.members
			.fetch(birthday.user_id)
			.catch(() => null);
		if (role) {
			if (member === null) continue;
			await member.roles.add(role).catch(() => null);
		}
		const channel = settings.birthday_channel_id
			? await guild.channels.fetch(settings.birthday_channel_id)
			: null;
		if (channel && channel.type === ChannelType.GuildText && member) {
			await channel.send(`Happy birthday to ${member}!`).catch(() => null);
		}
		await Birthday.updateLastCelebratedYear(birthday.user_id);
	}
	if (role === null) return;
	for (const member of role.members.values()) {
		const birthday = todaysBirthdays.find(
			(birthday) => birthday.user_id === member.user.id,
		);
		if (birthday === undefined)
			await member.roles.remove(role.id).catch(() => null);
	}
}

async function runBirthdayCheckForAllGuilds() {
	console.log("Running birthday checks...");
	for (const guild of client.guilds.cache.values()) {
		const settings = await Settings.getByGuild(guild.id);
		if (settings === undefined) continue;
		await runBirthdayCheckByGuild(settings.guild_id);
	}
	console.log("Finished running birthday checks.");
}
