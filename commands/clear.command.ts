import {
	ApplicationCommandOptionType,
	ChannelType,
	MessageFlags,
	PermissionFlagsBits,
} from "discord.js";
import type { Command } from "./types";

export default {
	description: "Bulk delete messages on a channel",
	permissions: [PermissionFlagsBits.Administrator],
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
		if (amount > 100) {
			await interaction.reply({
				content: `You can only bulk delete a max of 100 messages.`,
				flags: MessageFlags.Ephemeral,
			});
			return;
		}
		if (interaction.channel?.type !== ChannelType.GuildText) return;
		await interaction.channel.bulkDelete(amount);
		await interaction.reply({
			content: `${amount} messages cleared.`,
			flags: MessageFlags.Ephemeral,
		});
	},
} satisfies Command<"guild">;
