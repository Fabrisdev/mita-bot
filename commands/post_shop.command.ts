import {
	ApplicationCommandOptionType,
	MessageFlags,
	PermissionFlagsBits,
} from "discord.js";
import { shopMessage } from "../shop";
import type { Command } from "./types";

export default {
	description: "Post the shop on a channel",
	environment: "guild",
	permissions: [PermissionFlagsBits.Administrator],
	options: [
		{
			name: "channel",
			description: "Channel to post at",
			type: ApplicationCommandOptionType.Channel,
		},
	],
	run: async (interaction) => {
		const shop = shopMessage();
		const channel = interaction.options.getChannel("channel");
		if (channel === null) {
			if (interaction.channel?.isSendable()) {
				await interaction.channel.send(shop);
				await interaction.reply({
					content: "Sent!",
					flags: [MessageFlags.Ephemeral],
				});
				return;
			}
			await interaction.reply({
				content: "It seems I can't post the shop on this channel.",
				flags: [MessageFlags.Ephemeral],
			});
			return;
		}
		const chosenChannel = await interaction.guild.channels
			.fetch(channel.id)
			.catch(() => null);
		if (chosenChannel === null || !chosenChannel.isSendable()) {
			await interaction.reply({
				content: "It seems I can't post the shop on that channel.",
				flags: [MessageFlags.Ephemeral],
			});
			return;
		}
		await chosenChannel.send(shop);
		await interaction.reply({
			content: "Sent!",
			flags: [MessageFlags.Ephemeral],
		});
	},
} satisfies Command<"guild">;
