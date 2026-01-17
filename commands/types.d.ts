import type {
	ApplicationCommandOptionData,
	ChatInputCommandInteraction,
	PermissionFlagBits,
} from "discord.js";

export type Command = {
	description: string;
	options?: ApplicationCommandOptionData[];
	permissions: PermissionFlagBits[];
	run: (interaction: ChatInputCommandInteraction) => Promise<void>;
};
