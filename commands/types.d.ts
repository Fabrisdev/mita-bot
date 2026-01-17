import type {
	ApplicationCommandOptionData,
	ChatInputCommandInteraction,
} from "discord.js";

export type Command = {
	description: string;
	options?: ApplicationCommandOptionData[];
	run: (interaction: ChatInputCommandInteraction) => Promise<void>;
};
