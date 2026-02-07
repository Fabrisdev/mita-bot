import { AttachmentBuilder } from "discord.js";
import type { Command } from "./types";

export default {
	description: "Ping everyone on the server!",
	environment: "guild",
	permissions: [],

	run: async (interaction) => {
		const attachment = new AttachmentBuilder("./assets/fake_everyone.png", {
			name: "image.png",
		});
		await interaction.reply({
			files: [attachment],
		});
	},
} satisfies Command<"guild">;
