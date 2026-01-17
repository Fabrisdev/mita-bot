import {
	ApplicationCommandOptionType,
	MessageFlags,
	PermissionFlagsBits,
} from "discord.js";
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
			required: false,
		},
	],
	permissions: [PermissionFlagsBits.BanMembers],
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

		if (!member.bannable) {
			await interaction.reply({
				content: "I can't ban that user!",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		await interaction.guild.members.ban(user, { reason });

		await interaction.reply(
			`The user ${user.tag} has been banned with the reason: ${reason}`,
		);
		await showAlert(
			interaction.guild.id,
			`Moderator ${interaction.user.tag} has banned ${user.tag} with the reason: ${reason}`,
		);
	},
} satisfies Command<"guild">;
