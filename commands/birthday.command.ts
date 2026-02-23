import { ApplicationCommandOptionType, MessageFlags } from "discord.js";
import { Birthday } from "../database/birthday";
import type { Command } from "./types";

export default {
	description: "Set your birthday",
	environment: "guild",
	options: [
		{
			name: "month",
			description: "Month of birth",
			type: ApplicationCommandOptionType.Number,
			required: true,
		},
		{
			name: "day",
			description: "Day of birth",
			type: ApplicationCommandOptionType.Number,
			required: true,
		},
	],
	permissions: [],
	run: async (interaction) => {
		const month = interaction.options.getNumber("month", true);
		const day = interaction.options.getNumber("day", true);
		if (!isValidDate(month, day)) {
			interaction.reply({
				content: "That date doesn't make sense!",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}
		await Birthday.setBirthday({
			guildId: interaction.guild.id,
			userId: interaction.user.id,
			day,
			month,
		});
		await interaction.reply({
			content: "Birthday set!",
			flags: MessageFlags.Ephemeral,
		});
	},
} satisfies Command<"guild">;

function isValidDate(month: number, day: number) {
	const testDate = new Date(2000, month - 1, day);
	return testDate.getMonth() === month - 1 && testDate.getDate() === day;
}
