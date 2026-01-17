import { MessageFlags, PermissionFlagsBits } from "discord.js";
import type { Command } from "./types";

export default {
	description: "Setup Mita bot alerts channel",
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
		storeAlertsChannel(channelId);
		await interaction.reply(
			`The channel <#${channelId}> has been set as the alerts channel.`,
		);
	},
} satisfies Command<"guild">;

function storeAlertsChannel(channelId: string) {}
