import {
	ApplicationCommandOptionType,
	type GuildMember,
	MessageFlags,
	PermissionFlagsBits,
} from "discord.js";
import { addToUserHistory } from "../db";
import { parseDuration } from "../utils";
import { showAlert } from "./alert";
import type { Command } from "./types";

export default {
	description: "Ban a user",
	environment: "guild",
	options: [
		{
			name: "user",
			description: "User to ban",
			type: ApplicationCommandOptionType.User,
			required: true,
		},
		{
			name: "reason",
			description: "Ban reason",
			type: ApplicationCommandOptionType.String,
		},
		{
			name: "duration",
			description: "Ban duration",
			type: ApplicationCommandOptionType.String,
		},
	],
	permissions: [PermissionFlagsBits.BanMembers],
	run: async (interaction) => {
		const user = interaction.options.getUser("user", true);
		const reason =
			interaction.options.getString("reason") ?? "No reason specified";
		const rawDuration = interaction.options.getString("duration");

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
					"You can't time out a user who is above or in the same role hierarchy as you.",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		if (!member.bannable) {
			await interaction.reply({
				content: "I can't ban that user!",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		await user
			.send(
				`You've been banned from **${interaction.guild.name}** due to: ${reason}`,
			)
			.catch(() => null);
		await interaction.guild.members.ban(user, { reason });

		if (rawDuration) {
			const duration = parseDuration(rawDuration);
			await interaction.reply({
				content: "Temp bans are not implemented yet.",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		await interaction.reply(
			`The user ${user.tag} has been banned with the reason: ${reason}`,
		);
		await showAlert(
			interaction.guild.id,
			`Moderator ${interaction.user.tag} has banned ${user.tag} with the reason: ${reason}`,
		);
		await addToUserHistory(interaction.guild.id, user.id, {
			moderatorId: interaction.user.id,
			reason,
			type: "ban",
		});
	},
} satisfies Command<"guild">;
