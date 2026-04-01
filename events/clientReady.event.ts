import { ChannelType, type Client, type TextChannel } from "discord.js";
import { findBooleanArg } from "../args";
import { setupBirthdayIntervals } from "../birthdays";
import { MICHAN_CHANNEL_ID } from "../consts";
import { Log } from "../log";
import { publishRedditPosts } from "../reddit";
import { registerTempRoleTimeouts } from "../tempRolesHandler";

export let michanChannel: TextChannel;

export default async (client: Client<true>) => {
	Log.success(`Logged in as ${client.user.tag}!`);
	const c = await client.channels.fetch(MICHAN_CHANNEL_ID);
	if (c === null || c.type !== ChannelType.GuildText) {
		Log.error("Something is wrong with Mi-chan's channel.");
		throw new Error("Something is wrong with Mi-chan's channel.");
	}
	michanChannel = c;
	await registerTempRoleTimeouts();
	await setupBirthdayIntervals();
	const TWELVE_HOURS = 12 * 60 * 60 * 1000;
	setInterval(publishRedditPosts, TWELVE_HOURS);
	if (findBooleanArg("skip-reddit")) {
		Log.warn("Skipped initial Reddit check.");
		return;
	}
	await publishRedditPosts();
};
