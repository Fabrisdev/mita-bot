import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	type MessageActionRowComponentBuilder,
} from "discord.js";
import { CARTRIDGE_EMOJI } from "./consts";

export function shopMessage() {
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

	const row1 =
		new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId("shop_buy_color")
				.setLabel("🎨 Custom Color (500)")
				.setStyle(ButtonStyle.Primary),

			new ButtonBuilder()
				.setCustomId("shop_buy_xp")
				.setLabel("🚀 XP Boost x2 (900)")
				.setStyle(ButtonStyle.Success),

			new ButtonBuilder()
				.setCustomId("shop_buy_server_xp")
				.setLabel("🚀 SERVER XP x2 (3000)")
				.setStyle(ButtonStyle.Success),

			new ButtonBuilder()
				.setCustomId("shop_buy_role")
				.setLabel("👑 Custom Role (10000)")
				.setStyle(ButtonStyle.Secondary),
		);

	const row2 =
		new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId("shop_buy_timeout")
				.setLabel("🚫 Timeout Someone (500)")
				.setStyle(ButtonStyle.Danger),

			new ButtonBuilder()
				.setCustomId("shop_buy_rename")
				.setLabel("🎭 Change Name (1500)")
				.setStyle(ButtonStyle.Primary),

			new ButtonBuilder()
				.setCustomId("shop_buy_command")
				.setLabel("‼️ Custom Bot Command (20000)")
				.setStyle(ButtonStyle.Secondary),
		);

	const row3 =
		new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId("shop_check_balance")
				.setEmoji(CARTRIDGE_EMOJI)
				.setLabel("Check your balance")
				.setStyle(ButtonStyle.Primary),
		);

	return {
		embeds: [embed],
		components: [row1, row2, row3],
		files: ["./assets/BaseMitaShop.png"],
	};
}
