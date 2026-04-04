import { MessageFlags } from "discord.js";
import { shopMessage } from "../shop";
import type { Command } from "./types";

export default {
	description: "Open the shop!",
	environment: "guild",
	permissions: [],
	run: async (interaction) => {
		const message = shopMessage();
		await interaction.reply({
			...message,
			flags: [MessageFlags.Ephemeral],
		});
	},
} as Command<"guild">;
