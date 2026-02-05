import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import { addToUserHistory } from "../db";
import { showAlert } from "./alert";
import type { Command } from "./types";

export default {
	description: "Warn a user",
	environment: "guild",
	permissions: [PermissionFlagsBits.MuteMembers],
	options: [
		{
			name: "user",
			description: "User to warn",
			type: ApplicationCommandOptionType.User,
			required: true,
		},
		{
			name: "reason",
			description: "Reason to warn",
			type: ApplicationCommandOptionType.String,
		},
	],
	run: async (interaction) => {
		const user = interaction.options.getUser("user", true);
		const reason =
			interaction.options.getString("reason") ?? "No reason specified";
		await addToUserHistory(interaction.guild.id, user.id, {
			moderatorId: interaction.user.id,
			reason,
			type: "warn",
		});
		await interaction.reply(
			`The user ${user.tag} has been warned with the reason: ${reason}`,
		);
		await user
			.send(
				`You've been warned from **${interaction.guild.name}** due to: ${reason}`,
			)
			.catch(() => null);
		await showAlert(
			interaction.guild.id,
			`Moderator ${interaction.user.tag} has warned ${user.tag} with the reason: ${reason}`,
		);
	},
} satisfies Command<"guild">;
