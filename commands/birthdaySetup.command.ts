import {
	ApplicationCommandOptionType,
	MessageFlags,
	PermissionFlagsBits,
} from "discord.js";
import { Birthday } from "../db";
import type { Command } from "./types";

export default {
	description: "Setup birthday alerts channel",
	environment: "guild",
	options: [
		{
			name: "role",
			description: "Role to give",
			type: ApplicationCommandOptionType.Role,
		},
	],
	permissions: [PermissionFlagsBits.Administrator],
	run: async (interaction) => {
		if (!interaction.channel || !interaction.channel.isTextBased()) {
			await interaction.reply({
				content: "This command must be run in a text channel.",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}
		const role = interaction.options.getRole("role");
		if (role) {
			if (role.id === interaction.guild.id) {
				await interaction.reply({
					content: "Giving out the @everyone role is not allowed by Discord.",
					flags: MessageFlags.Ephemeral,
				});
				return;
			}

			if (role.managed) {
				await interaction.reply({
					content: "Giving out bot roles is not allowed by Discord.",
					flags: MessageFlags.Ephemeral,
				});
				return;
			}

			const botMember = interaction.guild.members.me;
			if (
				botMember === null ||
				role.position >= botMember.roles.highest.position
			) {
				await interaction.reply({
					content:
						"I can't give that role! It is above me in the role hierarchy.",
					flags: MessageFlags.Ephemeral,
				});
				return;
			}
			await Birthday.setRole({
				guildId: interaction.guild.id,
				roleId: role.id,
			});
		}
		const channelId = interaction.channel.id;
		await Birthday.setChannel({ guildId: interaction.guild.id, channelId });
		await interaction.reply(
			`The channel <#${channelId}> has been set as the birthday alerts channel.`,
		);
	},
} satisfies Command<"guild">;
