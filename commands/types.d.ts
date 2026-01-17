import type {
	ApplicationCommandOptionData,
	ChatInputCommandInteraction,
	Guild,
	PermissionFlagBits,
} from "discord.js";

type Environment = "guild" | "dm" | "both";

export type Command<E extends Environment> = {
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
