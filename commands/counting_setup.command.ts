import { MessageFlags, PermissionFlagsBits } from "discord.js";
import { Counting } from "./counting";
import type { Command } from "./types";

export default {
	description: "Setup the counting channel",
	environment: "guild",
	permissions: [PermissionFlagsBits.Administrator],
	run: async (interaction) => {
		await Counting.setChannel(interaction.channelId);
		await interaction.reply({
			content: "Current channel set as counting channel!",
			flags: MessageFlags.Ephemeral,
		});
	},
} satisfies Command<"guild">;
