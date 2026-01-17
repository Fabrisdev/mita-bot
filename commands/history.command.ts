import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import { getUserHistory } from "../db";
import type { Command } from "./types";

export default {
	description: "Get an user's history",
	environment: "guild",
	permissions: [PermissionFlagsBits.MuteMembers],
	options: [
		{
			name: "user",
			description: "User to check",
			type: ApplicationCommandOptionType.User,
			required: true,
		},
	],
	run: async (interaction) => {
		const user = interaction.options.getUser("user", true);
		const history = await getUserHistory(interaction.guild.id, user.id);
		if (history === undefined) {
			interaction.reply("User's history is clean.");
			return;
		}

		const message = history.map((incident) => {
			const date = new Date(incident.at).toLocaleString();
			return `**${incident.type.toUpperCase()}**: Issued by moderator <@${incident.moderatorId}> at ${date} with the reason: ${incident.reason}`;
		});
		await interaction.reply(message.join("\n"));
	},
} satisfies Command<"guild">;
