import type { Message } from "discord.js";
import { Ticket } from "../db";

export default async (message: Message) => {
	if (!message.guild) return;
	const guildId = message.guild.id;
	const ticketChannels = await Ticket.channelsFrom(guildId);
	ticketChannels.forEach((ticketChannel) => {
		if (message.channelId !== ticketChannel.channelId) return;
		Ticket.store({
			ticketId: ticketChannel.ticketId,
			message: {
				content: message.content,
				authorId: message.author.id,
				sentAt: message.createdTimestamp,
			},
		});
	});
};
