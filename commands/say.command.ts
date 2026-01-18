import {
	ApplicationCommandOptionType,
	MessageFlags,
	PermissionFlagsBits,
} from "discord.js";
import type { Command } from "./types";

export default {
	description: "Make me say something",
	environment: "guild",
	permissions: [PermissionFlagsBits.Administrator],
	options: [
		{
			name: "message",
			description: "Message to say",
			type: ApplicationCommandOptionType.String,
			required: true,
		},
		{
			name: "channel",
			description: "Channel where to say it",
			type: ApplicationCommandOptionType.Channel,
		},
	],
	run: async (interaction) => {
		const message = interaction.options.getString("message", true);
		const channelId =
			interaction.options.getChannel("channel")?.id ?? interaction.channelId;
		const channel = await interaction.guild.channels.fetch(channelId);
		if (!channel || !channel.isTextBased()) {
			await interaction.reply({
				content: "That doesn't seem to be a text channel.",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}
		await channel.send(message);
		await interaction.reply({
			content: "Message sent!",
			flags: MessageFlags.Ephemeral,
		});
	},
} satisfies Command<"guild">;
