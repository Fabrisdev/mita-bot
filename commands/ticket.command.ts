import { ChannelType, type Guild, MessageFlags } from "discord.js";
import { Ticket } from "../db";
import type { Command } from "./types";

export default {
	description: "Create a ticket to speak with our staff members",
	environment: "guild",
	permissions: [],
	run: async (interaction) => {
		const category = await findTicketsCategory(interaction.guild);
		const id = await Ticket.open({
			guildId: interaction.guild.id,
			ownerId: interaction.user.id,
		});
		const channel = await interaction.guild.channels.create({
			name: crypto.randomUUID(),
			type: ChannelType.GuildText,
			parent: category.id,
			permissionOverwrites: [
				{
					id: interaction.guild.id, // @everyone
					deny: ["ViewChannel"],
				},
				{
					id: interaction.user.id,
					allow: ["ViewChannel"],
				},
			],
		});
		await interaction.reply({
			content: `A ticket channel has been created for you at <#${channel.id}>`,
			flags: MessageFlags.Ephemeral,
		});
	},
} satisfies Command<"guild">;

async function findTicketsCategory(guild: Guild) {
	const channels = await guild.channels.fetch();
	const category = channels.find(
		(channel) =>
			channel?.type === ChannelType.GuildCategory && channel.name === "Tickets",
	);
	if (!category) {
		const newCategory = await guild.channels.create({
			name: "Tickets",
			type: ChannelType.GuildCategory,
			permissionOverwrites: [
				{
					id: guild.id, // @everyone
					deny: ["ViewChannel"],
				},
			],
		});
		return newCategory;
	}
	return category;
}
