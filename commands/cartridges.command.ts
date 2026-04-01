import { MessageFlags } from "discord.js";
import { CARTRIDGE_EMOJI } from "../consts";
import { Economy } from "../database/economy";
import type { Command } from "./types";

export default {
	description: "Check how many cartridges you have so far!",
	environment: "guild",
	permissions: [],
	run: async (interaction) => {
		const economy = Economy.of(interaction.user.id);
		const money = await economy.queryAmount();
		interaction.reply({
			content: `You currently have ${money} ${CARTRIDGE_EMOJI}`,
			flags: MessageFlags.Ephemeral,
		});
	},
} satisfies Command<"guild">;
