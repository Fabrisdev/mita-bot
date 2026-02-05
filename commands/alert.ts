import { ChannelType } from "discord.js";
import { client } from "../client";
import { getAlertsChannel } from "../db";

export async function showAlert(guildId: string, message: string) {
	const alertsChannel = await getAlertsChannel(guildId);
	if (!alertsChannel) return;
	const channel = await client.channels.fetch(alertsChannel).catch(() => null);
	if (channel == null) {
		const guild = await client.guilds.fetch(guildId);
		const owner = await guild.fetchOwner();
		owner.send(
			`⚠️ I tried to send an alert in **${guild.name}**, but the alerts channel no longer exists.
Please run **/setup** again and select the channel you want to use for alerts.`,
		);
		return;
	}
	if (channel.type !== ChannelType.GuildText) return;
	await channel.send(message);
}
