import {
	ApplicationCommandOptionType,
	ChannelType,
	PermissionFlagsBits,
} from "discord.js";
import type { Command } from "./types";

export default {
	description: "Bulk delete messages on a channel",
	permissions: [PermissionFlagsBits.ModerateMembers],
	environment: "guild",
	options: [
		{
			name: "amount",
			description: "Amount of messages to bulk delete",
			type: ApplicationCommandOptionType.Number,
			required: true,
		},
	],
	run: async (interaction) => {
		const amount = interaction.options.getNumber("amount", true);
		if (interaction.channel?.type !== ChannelType.GuildText) return;
		await interaction.channel.bulkDelete(amount);
		await interaction.reply({
			content: `${amount} messages cleared.`,
			ephemeral: true,
		});
	},
} satisfies Command<"guild">;
