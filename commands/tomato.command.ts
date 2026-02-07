import { createCanvas, loadImage } from "@napi-rs/canvas";
import { ApplicationCommandOptionType, AttachmentBuilder } from "discord.js";
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

		const width = 1344;
		const height = 1005;

		const canvas = createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		const backgroundImage = await loadImage("./assets/tomato.jpg");
		ctx.drawImage(backgroundImage, 0, 0);

		const avatarUrl = user.displayAvatarURL({
			extension: "png",
			size: 256,
		});

		const avatar = await loadImage(avatarUrl);
		const avatarSize = 350;
		const dx = 270;
		const dy = 370;

		ctx.save();
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
		const attachment = new AttachmentBuilder(buffer, { name: "image.png" });
		await interaction.reply({
			content: `${interaction.user} threw tomatoes at ${user}!`,
			files: [attachment],
		});
	},
} satisfies Command<"guild">;
