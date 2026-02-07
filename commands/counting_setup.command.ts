import { MessageFlags, PermissionFlagsBits } from "discord.js";
import { CountingDB } from "../db";
import type { Command } from "./types";

export default {
	description: "Setup the counting channel",
	environment: "guild",
	permissions: [PermissionFlagsBits.Administrator],
	run: async (interaction) => {
		await CountingDB.setChannel({
			channelId: interaction.channelId,
			guildId: interaction.guild.id,
		});
		await interaction.reply({
			content: "Current channel set as counting channel!",
			flags: MessageFlags.Ephemeral,
		});
	},
} satisfies Command<"guild">;
