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
		if (user.id === interaction.user.id) {
			interaction.reply({
				content: "No, you can't marry yourself...",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}
		if (user.id === interaction.client.user.id) {
			interaction.reply({
				content: "H-HUH?!",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}
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
		const acceptButton = new ButtonBuilder()
			.setCustomId(`accept-marry:${interaction.user.id}:${user.id}`)
			.setLabel("Accept")
			.setStyle(ButtonStyle.Success);
		const rejectButton = new ButtonBuilder()
			.setCustomId(`reject-marry:${interaction.user.id}:${user.id}`)
			.setLabel("Reject")
			.setStyle(ButtonStyle.Danger);
		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
			acceptButton,
			rejectButton,
		);
		await interaction.reply({
			content: `**${user} has asked marriage to ${member}**! Will they accept?`,
			components: [row],
		});
	},
} satisfies Command<"guild">;
