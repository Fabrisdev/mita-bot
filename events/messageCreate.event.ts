import type { Message } from "discord.js";
import { Ticket } from "../db";

export default async (message: Message) => {
	console.time("Whole message");
	if (!message.guild) return;
	const guildId = message.guild.id;
	console.time("Get ticket channels");
	const ticketChannels = await Ticket.channelsFrom(guildId);
	console.timeEnd("Get ticket channels");
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
	console.timeEnd("Whole message");
};
