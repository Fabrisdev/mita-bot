import { ChannelType } from "discord.js";
import { client } from "../client";
import { Log } from "../log";

export async function showAlert(message: string) {
	const channel = await client.channels
		.fetch("1372930870771585047")
		.catch(() => null);
	if (channel == null) {
		await Log.error("Couldn't send alert on #mod-log.");
		return;
	}
	if (channel.type !== ChannelType.GuildText) return;
	await channel.send(message);
}
