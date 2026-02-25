import { ChannelType } from "discord.js";
import { client } from "../client";
import { ALERTS_CHANNEL_ID } from "../consts";
import { Log } from "../log";

export async function showAlert(message: string) {
	const channel = await client.channels
		.fetch(ALERTS_CHANNEL_ID)
		.catch(() => null);
	if (channel == null) {
		await Log.error("Couldn't send alert on #mod-log.");
		return;
	}
	if (channel.type !== ChannelType.GuildText) return;
	await channel.send(message);
}
