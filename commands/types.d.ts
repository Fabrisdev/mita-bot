import type {
	ApplicationCommandOptionData,
	ChatInputCommandInteraction,
	Guild,
	PermissionFlagBits,
} from "discord.js";

export type CommandEnvironment = "guild" | "dm" | "both";

export type Command<E extends CommandEnvironment> = {
	description: string;
	options?: ApplicationCommandOptionData[];
	permissions: PermissionFlagBits[];
	environment: E;
	run: (
		interaction: E extends "guild"
			? ChatInputCommandInteraction & { guild: Guild }
			: E extends "dm"
				? ChatInputCommandInteraction & { guild: null }
				: ChatInputCommandInteraction,
	) => Promise<void>;
};
