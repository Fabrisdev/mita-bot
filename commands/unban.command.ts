import {
	ApplicationCommandOptionType,
	MessageFlags,
	PermissionFlagsBits,
} from "discord.js";
import type { Command } from "./types";

export default {
	description: "Unban a user",
	options: [
		{
			name: "user",
			description: "User to unban",
			type: ApplicationCommandOptionType.User,
			required: true,
		},
		{
			name: "reason",
			description: "Unban reason",
			type: ApplicationCommandOptionType.String,
			required: false,
		},
	],
	environment: "guild",
	permissions: [PermissionFlagsBits.BanMembers],
	run: async (interaction) => {
		const user = interaction.options.getUser("user", true);
		const reason =
			interaction.options.getString("reason") ?? "No reason specified";

		if (user.id === interaction.client.user.id) {
			await interaction.reply({
				content: "Aw, how sweet of you <3",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		if (!interaction.guild) {
			await interaction.reply({
				content: "This command can only be run inside the server.",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		const isBanned = await interaction.guild.bans.fetch(user).catch(() => null);
		if (!isBanned) {
			await interaction.reply({
				content: "That user isn't banned.",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		await interaction.guild.members.unban(user, reason);

		interaction.reply(`The user ${user.tag} has been unbanned!`);
	},
} satisfies Command<"guild">;
