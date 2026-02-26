import { createCanvas, loadImage } from "@napi-rs/canvas";
import {
	ApplicationCommandOptionType,
	AttachmentBuilder,
	type User,
} from "discord.js";
import type { Command } from "./types";

export default {
	description: "Throw tomatoes to someone!",
	environment: "guild",
	permissions: [],
	options: [
		{
			name: "user",
			description: "User to throw tomatoes to",
			type: ApplicationCommandOptionType.User,
			required: true,
		},
	],
	run: async (interaction) => {
		const user = interaction.options.getUser("user", true);
		if (user.id === interaction.client.user.id) {
			await interaction.reply("WHAT?! What did I do?!");
			return;
		}
		const image = await generateTomatoImage(user);
		await interaction.reply({
			content: `${interaction.user} threw tomatoes at ${user}!`,
			files: [image],
		});
	},
} satisfies Command<"guild">;

export async function generateTomatoImage(user: User) {
	const avatarUrl = user.displayAvatarURL({
		extension: "png",
		size: 256,
	});
	const width = 1344;
	const height = 1005;

	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext("2d");

	const backgroundImage = await loadImage("./assets/tomato.jpg");
	ctx.drawImage(backgroundImage, 0, 0);

	const avatar = await loadImage(avatarUrl);
	const avatarSize = 350;
	const dx = 270;
	const dy = 370;

	ctx.save();
	ctx.globalAlpha = 0.75;
	ctx.beginPath();
	ctx.arc(
		dx + avatarSize / 2,
		dy + avatarSize / 2,
		avatarSize / 2,
		0,
		Math.PI * 2,
	);
	ctx.closePath();
	ctx.clip();

	ctx.drawImage(avatar, dx, dy, avatarSize, avatarSize);
	ctx.restore();
	const buffer = canvas.toBuffer("image/png");
	return new AttachmentBuilder(buffer, { name: "image.png" });
}
