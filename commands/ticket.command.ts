import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChannelType,
	type Guild,
	MessageFlags,
} from "discord.js";
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
			channelId: interaction.channelId,
			ownerId: interaction.user.id,
		});
		const channel = await createChannel({
			categoryId: category.id,
			guild: interaction.guild,
			userId: interaction.user.id,
			name: String(id),
		});
		const closeButton = createCloseButton(id);
		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
			closeButton,
		);
		await channel.send({
			content: `Ticket opened by <@${interaction.user.id}>`,
			components: [row],
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

async function createChannel({
	guild,
	categoryId,
	userId,
	name,
}: {
	guild: Guild;
	categoryId: string;
	userId: string;
	name: string;
}) {
	return await guild.channels.create({
		name,
		type: ChannelType.GuildText,
		parent: categoryId,
		permissionOverwrites: [
			{
				id: guild.id, // @everyone
				deny: ["ViewChannel"],
			},
			{
				id: userId,
				allow: ["ViewChannel"],
			},
		],
	});
}

function createCloseButton(ticketId: number) {
	return new ButtonBuilder()
		.setCustomId(`close-ticket:${ticketId}`)
		.setLabel("Close ticket")
		.setStyle(ButtonStyle.Danger);
}
