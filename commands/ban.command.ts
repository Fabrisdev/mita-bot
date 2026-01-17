import { ApplicationCommandOptionType } from "discord.js";
import type { Command } from "./types";

export default {
	description: "Ban a user",
	options: [
		{
			name: "user",
			description: "User to ban",
			type: ApplicationCommandOptionType.User,
			required: true,
		},
		{
			name: "reason",
			description: "Ban reason",
			type: ApplicationCommandOptionType.String,
			required: false,
		},
	],
	run: async (interaction) => {
		const user = interaction.options.getUser("user", true);
		const reason =
			interaction.options.getString("reason") ?? "No reason specified";
		interaction.reply(
			`The user ${user.tag} has been banned with the reason: ${reason}`,
		);
	},
} satisfies Command;
