import type { ChatInputCommandInteraction } from "discord.js";

export type Command = {
	description: string;
	run: (interaction: ChatInputCommandInteraction) => Promise<void>;
};
