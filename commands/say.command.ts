import {
	ApplicationCommandOptionType,
	MessageFlags,
	PermissionFlagsBits,
} from "discord.js";
import { isAwaitKeyword } from "typescript";
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
		const MAX_LENGTH = 2000;
		if (message.length > MAX_LENGTH) {
			await interaction.reply({
				content: "Message length must be less than 2000 characters.",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}
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

		const me = interaction.guild.members.me;
		if (!me) {
			await interaction.reply({
				content: "Wasn't able to check if I have access to the channel or not.",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}
		const permissions = channel.permissionsFor(me);

		if (!permissions?.has(PermissionFlagsBits.ViewChannel)) {
			await interaction.reply({
				content: "I can't see that channel.",
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
