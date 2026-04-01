import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	type MessageActionRowComponentBuilder,
} from "discord.js";
import { client } from "./client";
import { CARTRIDGE_EMOJI, isDevEnvironment } from "./consts";
import { token } from "./environment";
import { registerEvents } from "./events/register";
import { Log } from "./log";

process.on("unhandledRejection", (reason) => {
	console.error(reason);
});

process.on("uncaughtException", (error) => {
	console.error(error);
});

Log.log(isDevEnvironment ? "DEV mode enabled." : "Working on production.");
await registerEvents();
await client.login(token());

//await sendShop();

async function sendShop() {
	const channel = await client.channels.fetch("1478591241779150921");

	console.log("Sending shop...");

	if (!channel?.isSendable()) {
		throw new Error("Channel is not sendable");
	}

	const embed = new EmbedBuilder()
		.setColor("#ffcc00")
		.setTitle("🛒 Mita's Shop")
		.setImage("attachment://BaseMitaShop.png")
		.setDescription(
			`Welcome to **Mita's Shop**!\n\n` +
				`Trade your ${CARTRIDGE_EMOJI} for unique items and rare upgrades.\n` +
				`What will you take with you today?\n`,
		)
		.setFooter({ text: "Looking to buy something nice, eh?" });

	// ---- ROW 1 (4 buttons) ----
	const row1 =
		new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId("buy_color")
				.setLabel("🎨 Custom Color (500)")
				.setStyle(ButtonStyle.Primary),

			new ButtonBuilder()
				.setCustomId("buy_xp")
				.setLabel("🚀 XP Boost x2 (900)")
				.setStyle(ButtonStyle.Success),

			new ButtonBuilder()
				.setCustomId("buy_server_xp")
				.setLabel("🚀 SERVER XP x2 (3000)")
				.setStyle(ButtonStyle.Success),

			new ButtonBuilder()
				.setCustomId("buy_role")
				.setLabel("👑 Custom Role (10000)")
				.setStyle(ButtonStyle.Secondary),
		);

	// ---- ROW 2 (2 buttons) ----
	const row2 =
		new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId("buy_timeout")
				.setLabel("🚫 Timeout Someone (500)")
				.setStyle(ButtonStyle.Danger),

			new ButtonBuilder()
				.setCustomId("buy_rename")
				.setLabel("🎭 Change Name (1500)")
				.setStyle(ButtonStyle.Primary),

			new ButtonBuilder()
				.setCustomId("buy_command")
				.setLabel("‼️ Custom Bot Command (20000)")
				.setStyle(ButtonStyle.Secondary),
		);

	const row3 =
		new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId("check_balance")
				.setEmoji(CARTRIDGE_EMOJI)
				.setLabel("Check your balance")
				.setStyle(ButtonStyle.Primary),
		);

	await channel.send({
		embeds: [embed],
		components: [row1, row2, row3],
		files: ["./assets/BaseMitaShop.png"],
	});
}
