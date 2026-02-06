import {
	ApplicationCommandOptionType,
	MessageFlags,
	PermissionFlagsBits,
} from "discord.js";
import { parseDuration } from "../utils";
import { showAlert } from "./alert";
import type { Command } from "./types";

export default {
	description: "Timeout a user",
	environment: "guild",
	permissions: [PermissionFlagsBits.ModerateMembers],
	options: [
		{
			name: "user",
			description: "User to timeout",
			type: ApplicationCommandOptionType.User,
			required: true,
		},
		{
			name: "duration",
			description: "Timeout duration",
			type: ApplicationCommandOptionType.String,
			required: true,
		},
		{
			name: "reason",
			description: "Reason for timeout",
			type: ApplicationCommandOptionType.String,
			required: true,
		},
	],
	run: async (interaction) => {
		const user = interaction.options.getUser("user", true);
		const durationText = interaction.options.getString("duration", true);
		const reason = interaction.options.getString("reason", true);
		const duration = parseDuration(durationText);
		if (duration === null) {
			interaction.reply({
				content:
					"Sorry, I didn't understand that duration. Some correct usage examples are: '10d', '30m', '5h'",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		if (user.id === interaction.client.user.id) {
			await interaction.reply({
				content: "Why?! :(",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		const member = await interaction.guild.members.fetch(user);
		const botMember = interaction.guild.members.me;
		if (
			botMember === null ||
			member.roles.highest.position >= botMember.roles.highest.position
		) {
			await interaction.reply({
				content:
					"I can't time out this user since they are above me in the role hierarchy.",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}
		if (!member.moderatable) {
			await interaction.reply({
				content: "I can't time out this user.",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}
		await member.timeout(duration, reason);
		await interaction.reply(
			`The user ${user.tag} has been timed out with the reason: ${reason}`,
		);
		await showAlert(
			interaction.guild.id,
			`Moderator ${interaction.user.tag} has timed out ${user.tag} for ${durationText} with the reason: ${reason}`,
		);
	},
} satisfies Command<"guild">;
