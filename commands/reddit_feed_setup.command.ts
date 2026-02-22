import { PermissionFlagsBits } from "discord.js";
import { Settings } from "../db";
import type { Command } from "./types";

export default {
	description: "Setup the MisideReddit posts feed channel.",
	environment: "guild",
	permissions: [PermissionFlagsBits.Administrator],
	run: async (interaction) => {
		await Settings.setRedditFeedChannel({
			guildId: interaction.guild.id,
			channelId: interaction.channelId,
		});
		interaction.reply("Current channel set as reddit feed!");
	},
} satisfies Command<"guild">;
