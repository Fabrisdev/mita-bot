import { MessageFlags } from "discord.js";
import { Eggs } from "../database/eggs";
import type { Command } from "./types";

export default {
	description: "Check how many eggs you have collected so far!",
	environment: "guild",
	permissions: [],
	run: async (interaction) => {
		const economy = Eggs.of(interaction.user.id);
		const amount = await economy.query();
		interaction.reply({
			content: `You currently have ${amount} eggs.`,
			flags: MessageFlags.Ephemeral,
		});
	},
} satisfies Command<"guild">;
