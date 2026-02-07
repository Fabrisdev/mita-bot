import { ChannelType, type Message } from "discord.js";
import { Counting } from "../commands/counting";
import { Ticket } from "../db";

export default async (message: Message) => {
	ticketSystem(message);
	countingSystem(message);
};

async function ticketSystem(message: Message) {
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
	await Ticket.store({
		ticketId: ticket._id,
		message: {
			content: message.content,
			authorId: message.author.id,
			sentAt: message.createdTimestamp,
		},
	});
}

async function countingSystem(message: Message) {
	if (!message.guild) return;
	if (message.channel.type !== ChannelType.GuildText) return;
	const guildId = message.guild.id;
	const data = await Counting.get(guildId);
	if (data === null) return;
	if (message.channel.id !== data.channelId) return;

	const { content } = message;
	const nextNumber = data.currentNumber + 1;
	if (content !== nextNumber.toString()) return;
	data.currentNumber += 1;
	await message.react("✅");
}
