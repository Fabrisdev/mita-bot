import {
	ApplicationCommandOptionType,
	MessageFlags,
	PermissionFlagsBits,
} from "discord.js";
import type { Command } from "./types";

export default {
	description: "Give a role to a user",
	environment: "guild",
	permissions: [PermissionFlagsBits.Administrator],
	options: [
		{
			name: "user",
			description: "User to give the role to",
			type: ApplicationCommandOptionType.User,
			required: true,
		},
		{
			name: "role",
			description: "Role to give",
			type: ApplicationCommandOptionType.Role,
			required: true,
		},
		{
			name: "duration",
			description: "Duration to give the role for",
			type: ApplicationCommandOptionType.String,
		},
	],
	run: async (interaction) => {
		const user = interaction.options.getUser("user", true);
		const role = interaction.options.getRole("role", true);
		const duration = interaction.options.getString("duration");

		const member = await interaction.guild.members.fetch(user.id);
		if (duration === null) {
			await member.roles.add(role.id);
			await interaction.reply({
				content: "Role given!",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}
	},
} satisfies Command<"guild">;
