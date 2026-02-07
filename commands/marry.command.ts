import {
	ActionRowBuilder,
	ApplicationCommandOptionType,
	ButtonBuilder,
	ButtonStyle,
	MessageFlags,
} from "discord.js";
import type { Command } from "./types";

export default {
	description: "Ask someone for marriage!",
	environment: "guild",
	permissions: [],
	options: [
		{
			name: "user",
			description: "User who you want to ask for marriage",
			type: ApplicationCommandOptionType.User,
			required: true,
		},
	],
	run: async (interaction) => {
		const user = interaction.options.getUser("user", true);
		const member = await interaction.guild.members
			.fetch(user)
			.catch(() => null);
		if (member === null) {
			interaction.reply({
				content: "That user isn't on the server.",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}
		await interaction.reply({
			content: `**${user} has asked marriage to ${member}**! Will they accept?`,
		});
	},
} satisfies Command<"guild">;
