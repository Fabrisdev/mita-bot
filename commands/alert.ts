import type { TextChannel } from "discord.js";
import { client } from "../client";

export async function alert(channelId: string, message: string) {
	const channel = await client.channels.fetch(channelId);
	if (channel == null) return; // in the future, notify admins that the alerts channel no longer exists
	if (!channel.isTextBased()) return;
	await (channel as TextChannel).send(message);
}
