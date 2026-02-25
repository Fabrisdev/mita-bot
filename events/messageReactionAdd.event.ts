import {
	ActionRowBuilder,
	type Attachment,
	ButtonBuilder,
	ButtonStyle,
	type Collection,
	EmbedBuilder,
	type MessageReaction,
	type User,
} from "discord.js";
import { client } from "../client";
import { STARBOARD_CHANNEL_ID } from "../consts";
import { Starboard } from "../database/starboard";

export default async (reaction: MessageReaction, user: User) => {
	if (reaction.emoji.name !== "⭐") return;
	if (!reaction.message.author || reaction.message.content === null) return;
	if (reaction.message.author.id === user.id) {
		await reaction.users.remove(user.id);
		return;
	}
	if (reaction.count < 5) return;
	const channel = await client.channels.fetch(STARBOARD_CHANNEL_ID);
	if (!channel?.isSendable()) return;

	const messageToSend = createMessage({
		name: reaction.message.author.username,
		iconURL: reaction.message.author.displayAvatarURL(),
		content: reaction.message.content,
		messageId: reaction.message.id,
		createdAt: reaction.message.createdAt,
		attachments: reaction.message.attachments,
		messageUrl: reaction.message.url,
		reactionCount: reaction.count,
		channelId: reaction.message.channel.id,
	});

	const isAlreadyThere = await Starboard.isAlreadyThere(reaction.message.id);
	if (isAlreadyThere) {
		const starboardMessageId = isAlreadyThere.starboard_message_id;
		const message = await channel.messages.fetch(starboardMessageId);
		await message.edit(messageToSend);
	}

	await channel.send(messageToSend);
};

function createMessage({
	name,
	iconURL,
	content,
	messageId,
	createdAt,
	attachments,
	messageUrl,
	channelId,
	reactionCount,
}: {
	messageId: string;
	name: string;
	content: string;
	iconURL: string;
	createdAt: Date;
	attachments: Collection<string, Attachment>;
	messageUrl: string;
	channelId: string;
	reactionCount: number;
}) {
	const embed = new EmbedBuilder()
		.setColor("#ffcc00")
		.setAuthor({
			name,
			iconURL,
		})
		.setDescription(content || "*Empty message*")
		.setFooter({
			text: `Message ID: ${messageId} • ${createdAt.toLocaleString()}`,
		});

	const imageAttachment = attachments.find((a) =>
		a.contentType?.startsWith("image/"),
	);

	if (imageAttachment) {
		embed.setImage(imageAttachment.url);
	}

	const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setLabel("Jump to message")
			.setStyle(ButtonStyle.Link)
			.setURL(messageUrl),
	);
	return {
		content: `${reactionCount} ⭐ | <#${channelId}>`,
		embeds: [embed],
		components: [row],
	};
}
