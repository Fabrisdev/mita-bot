import type { TextChannel } from "discord.js";
import { client } from "../client";
import { getAlertsChannel } from "../db";

export async function showAlert(guildId: string, message: string) {
	const alertsChannel = await getAlertsChannel(guildId);
	if (!alertsChannel) return;
	const channel = await client.channels.fetch(alertsChannel);
	if (channel == null) return; // in the future, notify admins that the alerts channel no longer exists
	if (!channel.isTextBased()) return;
	await (channel as TextChannel).send(message);
}
