import {
	ApplicationCommandOptionType,
	type GuildMember,
	MessageFlags,
	PermissionFlagsBits,
} from "discord.js";
import { History } from "../database/history";
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

		const member = await interaction.guild.members
			.fetch(user.id)
			.catch(() => null);

		if (!member) {
			await interaction.reply({
				content: "That user does not seem to be on the server.",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		const moderator = interaction.member as GuildMember;
		if (member.roles.highest.position >= moderator.roles.highest.position) {
			await interaction.reply({
				content:
					"You can't time out a user who is above or in the same role hierarchy as you.",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		await History.addToUser(user.id, {
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
			`Moderator ${interaction.user.tag} has warned ${user.tag} with the reason: ${reason}`,
		);
	},
} satisfies Command<"guild">;
