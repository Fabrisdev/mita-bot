import {
	ApplicationCommandOptionType,
	type GuildMember,
	MessageFlags,
	PermissionFlagsBits,
} from "discord.js";
import { addToUserHistory } from "../db";
import { showAlert } from "./alert";
import type { Command } from "./types";

export default {
	description: "Kick an user",
	permissions: [PermissionFlagsBits.KickMembers],
	environment: "guild",
	options: [
		{
			name: "user",
			description: "User to kick",
			required: true,
			type: ApplicationCommandOptionType.User,
		},
		{
			name: "reason",
			description: "Kick reason",
			type: ApplicationCommandOptionType.String,
		},
	],
	run: async (interaction) => {
		const user = interaction.options.getUser("user", true);
		const reason =
			interaction.options.getString("reason") ?? "No reason specified";
		if (user.id === interaction.client.user.id) {
			await interaction.reply({
				content: "No! :(",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

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
					"You can't kick a user who is above or in the same role hierarchy as you.",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		if (!member.kickable) {
			await interaction.reply({
				content: "I can't kick that user!",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}
		await user
			.send(
				`You've been kicked from **${interaction.guild.name}** due to: ${reason}`,
			)
			.catch(() => null);
		await interaction.guild.members.kick(user, reason);
		await interaction.reply(
			`The user ${user.tag} has been kicked with the reason: ${reason}`,
		);
		await showAlert(
			interaction.guild.id,
			`Moderator ${interaction.user.tag} has kicked ${user.tag} with the reason: ${reason}`,
		);
		await addToUserHistory(interaction.guild.id, user.id, {
			moderatorId: interaction.user.id,
			reason,
			type: "kick",
		});
	},
} satisfies Command<"guild">;
