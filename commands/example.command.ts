import type { Command } from "./types";

export default {
	description: "Just an example command",
	permissions: [],
	run: async (interaction) => {
		interaction.reply(`Hey ${interaction.user.tag}!`);
	},
} satisfies Command;
