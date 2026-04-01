import { ChannelType, type Message, type TextChannel } from "discord.js";
import { MICHAN_CHANNEL_ID } from "../../consts";
import { Log } from "../../log";
import { cycle } from "../../utils";
import { michanChannel } from "../clientReady.event";

type OriginalMessageInfo = {
	messageId: string;
	channelId: string;
};

const trackedMessages = new Map<string, OriginalMessageInfo>();

//const replies = cycle(["Yes?", "What's up?", "Huh?", "What?", "Hi!", "Hello!"]);
export default async (message: Message) => {
	if (!message.guild) return;
	if (message.author.bot) return;
	if (message.channelId === MICHAN_CHANNEL_ID) {
		if (message.reference?.messageId) {
			const referenceId = message.reference.messageId;
			const originalInfo = trackedMessages.get(referenceId);
			if (originalInfo === undefined) return;
			const channel = await message.guild.channels
				.fetch(originalInfo.channelId)
				.catch(() => null);
			if (channel === null || channel.type !== ChannelType.GuildText) return;
			const originalMessage = await channel.messages
				.fetch(originalInfo.messageId)
				.catch(() => null);
			if (originalMessage === null) return;
			await originalMessage.reply({
				content: message.content,
				files: [...message.attachments.values()],
			});
			const referenceMessage =
				await message.channel.messages.fetch(referenceId);
			if (referenceMessage.deletable) referenceMessage.delete();
			if (message.deletable) message.delete();
			trackedMessages.delete(referenceId);
		}

		return;
	}
	if (message.mentions.has(message.client.user)) {
		//message.reply(replies.next().value);
		const messageLink = `https://discord.com/channels/${message.guildId}/${message.channelId}/${message.id}`;
		const messageSent = await michanChannel.send(
			`- From ${message.author}\n- Message link: ${messageLink}\n> ${message.content}`,
		);
		trackedMessages.set(messageSent.id, {
			messageId: message.id,
			channelId: message.channelId,
		});
	}
};
