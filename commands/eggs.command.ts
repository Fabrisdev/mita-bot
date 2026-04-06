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
		const best = await Eggs.leaderboard();

		const leaderboard = best
			.map((top) => ({
				amount,
				user: interaction.guild.members.cache.find(
					(user) => user.id === top.user_id,
				),
			}))
			.map(
				(top, i) =>
					`${i}. **${top.user?.displayName}** with ${top.amount} eggs :star:`,
			)
			.map((line) => `${line}\n`);
		interaction.reply(
			`# This is the leaderboard!\n${leaderboard}\n(*You currently have ${amount} eggs*)`,
		);
	},
} satisfies Command<"guild">;
