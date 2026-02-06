import { MessageFlags, PermissionFlagsBits } from "discord.js";
import { Birthday } from "../db";
import type { Command } from "./types";

export default {
	description: "Setup birthday alerts channel",
	environment: "guild",
	permissions: [PermissionFlagsBits.Administrator],
	run: async (interaction) => {
		if (!interaction.channel || !interaction.channel.isTextBased()) {
			await interaction.reply({
				content: "This command must be run in a text channel.",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}
		const channelId = interaction.channel.id;
		await Birthday.setChannel({ guildId: interaction.guild.id, channelId });
		await interaction.reply(
			`The channel <#${channelId}> has been set as the birthday alerts channel.`,
		);
	},
} satisfies Command<"guild">;
