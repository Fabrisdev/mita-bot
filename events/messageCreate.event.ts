import { ChannelType, type Message } from "discord.js";
import { Ticket } from "../db";

export default async (message: Message) => {
	if (!message.guild) return;
	const guildId = message.guild.id;
	if (message.channel.type !== ChannelType.GuildText) return;
	if (!message.channel.parent) return;
	if (message.channel.parent.name !== "Tickets") return;
	const ticket = await Ticket.findByChannelName({
		guildId,
		channelName: message.channel.name,
	});
	if (ticket === null) return;
	Ticket.store({
		ticketId: ticket._id,
		message: {
			content: message.content,
			authorId: message.author.id,
			sentAt: message.createdTimestamp,
		},
	});
};
