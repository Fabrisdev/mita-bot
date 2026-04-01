import {
	ApplicationCommandOptionType,
	ChannelType,
	MessageFlags,
	PermissionFlagsBits,
} from "discord.js";
import { guildId as _guildId } from "../environment";
import type { Command } from "./types";

export default {
	description: "Pick a random user from a message's reactions!",
	environment: "guild",
	permissions: [PermissionFlagsBits.Administrator],
	options: [
		{
			name: "message_link",
			description: "Message link (You can get it on More > Copy Message Link)",
			type: ApplicationCommandOptionType.String,
			required: true,
		},
	],
	run: async (interaction) => {
		const messageLink = interaction.options.getString("message_link", true);
		const sliceLength = "https://discord.com/channels/".length;
		const [guildId, channelId, messageId] = messageLink
			.slice(sliceLength)
			.split("/");
		if (
			guildId === undefined ||
			channelId === undefined ||
			messageId === undefined
		) {
			interaction.reply({
				content: "That link doesn't appear to be correct.",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}
		if (guildId !== _guildId()) {
			interaction.reply({
				content: "That message is from a different server.",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}
		const channel = await interaction.guild.channels
			.fetch(channelId)
			.catch(() => null);
		if (channel === null) {
			interaction.reply({
				content: "That channel doesn't exist or I don't have access to it.",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}
		if (channel.type !== ChannelType.GuildText) {
			interaction.reply({
				content: "That's not a text channel.",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}
		const message = await channel.messages.fetch(messageId).catch(() => null);
		if (message === null) {
			interaction.reply({
				content: "That message doesn't exist.",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}
		const reactions = message.reactions.cache.first();
		if (reactions === undefined) {
			interaction.reply({
				content: "Nobody has reacted yet!",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}
		const users = await reactions.users.fetch();
		const chosen = users.random();
		if (chosen === undefined) {
			await interaction.reply({
				content: "Nobody has reacted yet!",
				flags: MessageFlags.Ephemeral,
			});
			return;
		}
		await interaction.reply(
			`The winner is ${chosen.displayName} (${chosen.id})! 🎉`,
		);
	},
} satisfies Command<"guild">;
