import {
	ApplicationCommandOptionType,
	MessageFlags,
	PermissionFlagsBits,
} from "discord.js";
import { TempRoles } from "../db";
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

		const member = await interaction.guild.members.fetch(user.id);

		if (duration === null) {
			await member.roles.add(role.id);
			await interaction.reply({
				content: "Role given!",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		const time = parseDuration(duration);
		if (time === null) {
			await interaction.reply(
				"Sorry, I didn't understand that duration. Some correct usage examples are: '10d', '30m', '5h'",
			);
			return;
		}

		await member.roles.add(role.id);

		const expiresOn = Date.now() + time;
		const id = await TempRoles.add({
			guildId: interaction.guild.id,
			roleId: role.id,
			userId: user.id,
			expiresOn,
		});
		setTimeout(() => {
			TempRoles.remove(id);
		}, time);
		await interaction.reply({
			content: "Role given!",
			flags: MessageFlags.Ephemeral,
		});
	},
} satisfies Command<"guild">;

function parseDuration(duration: string) {
	const match = duration.trim().match(/^(\d+)\s*(s|m|h|d)$/i);
	if (!match) return null;
	if (match[1] === undefined || match[2] === undefined) return null;
	const value = Number(match[1]);
	const unit = match[2].toLowerCase();

	const multipliers: Record<string, number> = {
		s: 1_000,
		m: 60_000,
		h: 3_600_000,
		d: 86_400_000,
	};

	return value * (multipliers[unit] as number);
}
