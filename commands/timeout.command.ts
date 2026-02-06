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
	permissions: [PermissionFlagsBits.MuteMembers],
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
		const member = await interaction.guild.members.fetch(user);
		await member.timeout(duration, reason);
		await showAlert(
			interaction.guild.id,
			`Moderator ${interaction.user.tag} has timed out ${user.tag} for ${durationText} with the reason: ${reason}`,
		);
	},
} satisfies Command<"guild">;
