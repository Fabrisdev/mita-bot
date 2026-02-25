import { ChannelType } from "discord.js";
import { client } from "./client";
import { BIRTHDAY_CHANNEL_ID, BIRTHDAY_ROLE_ID } from "./consts";
import { Birthday } from "./database/birthday";
import { guildId } from "./environment";
import { Log } from "./log";

export async function setupBirthdayIntervals() {
	const EVERY_HOUR = 60 * 60 * 1000;
	await runBirthdayCheckWithLog();
	setInterval(async () => {
		await runBirthdayCheckWithLog();
	}, EVERY_HOUR);
}

async function runBirthdayCheck() {
	const guild = await client.guilds.fetch(guildId());
	const role = await guild.roles.fetch(BIRTHDAY_ROLE_ID);
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
		const channel = await guild.channels.fetch(BIRTHDAY_CHANNEL_ID);
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

async function runBirthdayCheckWithLog() {
	Log.log("Running birthday checks...");
	await runBirthdayCheck();
	Log.log("Finished running birthday checks.");
}
