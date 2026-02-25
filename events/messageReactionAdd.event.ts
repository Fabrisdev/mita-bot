import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	type MessageReaction,
	type User,
} from "discord.js";
import { client } from "../client";
import { STARBOARD_CHANNEL_ID } from "../consts";

export default async (reaction: MessageReaction, user: User) => {
	if (reaction.emoji.name !== "⭐") return;
	if (!reaction.message.author || reaction.message.content === null) return;
	if (reaction.message.author.id === user.id) {
		await reaction.users.remove(user.id);
		return;
	}
	if (reaction.count < 5) return;
	const channel = await client.channels.fetch(STARBOARD_CHANNEL_ID);
	if (!channel?.isSendable()) {
		return;
	}

	const embed = new EmbedBuilder()
		.setColor("#ffcc00")
		.setAuthor({
			name: reaction.message.author.username,
			iconURL: reaction.message.author.displayAvatarURL(),
		})
		.setDescription(reaction.message.content || "*Sin texto*")
		.setFooter({
			text: `Message ID: ${reaction.message.id} • ${reaction.message.createdAt.toLocaleString()}`,
		});

	const imageAttachment = reaction.message.attachments.find((a) =>
		a.contentType?.startsWith("image/"),
	);

	if (imageAttachment) {
		embed.setImage(imageAttachment.url);
	}

	const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setLabel("Jump to message")
			.setStyle(ButtonStyle.Link)
			.setURL(reaction.message.url),
	);

	await channel.send({
		content: `${reaction.count} ⭐ | <#${reaction.message.channel.id}>`,
		embeds: [embed],
		components: [row],
	});
};
