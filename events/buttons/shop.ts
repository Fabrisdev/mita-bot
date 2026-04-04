import {
	type ButtonInteraction,
	type CacheType,
	LabelBuilder,
	MessageFlags,
	ModalBuilder,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
	TextDisplayBuilder,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";
import { showAlert } from "../../commands/alert";
import { CARTRIDGE_EMOJI } from "../../consts";
import { Economy } from "../../database/economy";

export async function handleShopInteraction(
	interaction: ButtonInteraction<CacheType>,
) {
	const id = interaction.customId.slice("shop_".length);
	const economy = Economy.of(interaction.user.id);
	const balance = await economy.queryBalance();
	if (id === "check_balance") {
		await interaction.reply({
			content: `You currently have ${balance} ${CARTRIDGE_EMOJI}`,
			flags: [MessageFlags.Ephemeral],
		});
		return;
	}
	if (id === "buy_color") {
		if (balance < 500) {
			await interaction.reply({
				content: "You don't have enough cartridges!",
				flags: [MessageFlags.Ephemeral],
			});
			return;
		}
		const modal = new ModalBuilder()
			.setCustomId(`modal_store_buy_color`)
			.setTitle("Custom color purchase");

		const colorSelect = new StringSelectMenuBuilder()
			.setCustomId("color")
			.setPlaceholder("Choose a color")
			.setRequired(true)
			.addOptions(
				new StringSelectMenuOptionBuilder()
					.setLabel("Red")
					.setDescription("HEX: #FF0000 - RGB: (255, 0, 0)")
					.setValue("FF0000"),

				new StringSelectMenuOptionBuilder()
					.setLabel("Green")
					.setDescription("HEX: #00FF00 - RGB: (0, 255, 0)")
					.setValue("00FF00"),

				new StringSelectMenuOptionBuilder()
					.setLabel("Blue")
					.setDescription("HEX: #0000FF - RGB: (0, 0, 255)")
					.setValue("0000FF"),

				new StringSelectMenuOptionBuilder()
					.setLabel("Yellow")
					.setDescription("HEX: #FFFF00 - RGB: (255, 255, 0)")
					.setValue("FFFF00"),

				new StringSelectMenuOptionBuilder()
					.setLabel("Cyan")
					.setDescription("HEX: #00FFFF - RGB: (0, 255, 255)")
					.setValue("00FFFF"),

				new StringSelectMenuOptionBuilder()
					.setLabel("Magenta")
					.setDescription("HEX: #FF00FF - RGB: (255, 0, 255)")
					.setValue("FF00FF"),

				new StringSelectMenuOptionBuilder()
					.setLabel("Orange")
					.setDescription("HEX: #FFA500 - RGB: (255, 165, 0)")
					.setValue("FFA500"),

				new StringSelectMenuOptionBuilder()
					.setLabel("Purple")
					.setDescription("HEX: #800080 - RGB: (128, 0, 128)")
					.setValue("800080"),

				new StringSelectMenuOptionBuilder()
					.setLabel("Pink")
					.setDescription("HEX: #FFC0CB - RGB: (255, 192, 203)")
					.setValue("FFC0CB"),

				new StringSelectMenuOptionBuilder()
					.setLabel("White")
					.setDescription("HEX: #FFFFFF - RGB: (255, 255, 255)")
					.setValue("FFFFFF"),

				new StringSelectMenuOptionBuilder()
					.setLabel("Black")
					.setDescription("HEX: #000000 - RGB: (0, 0, 0)")
					.setValue("000000"),

				new StringSelectMenuOptionBuilder()
					.setLabel("Gray")
					.setDescription("HEX: #808080 - RGB: (128, 128, 128)")
					.setValue("808080"),
			);

		const colorLabel = new LabelBuilder()
			.setLabel("What color would you like?")
			.setStringSelectMenuComponent(colorSelect);

		const customColorInput = new TextInputBuilder()
			.setCustomId("custom_color")
			.setStyle(TextInputStyle.Short)
			.setRequired(false)
			.setPlaceholder("in between red and orange, pink just a bit white");

		const customColorLabel = new LabelBuilder()
			.setLabel("Color not listed? Type it below")
			.setTextInputComponent(customColorInput);

		const bottomText = new TextDisplayBuilder().setContent(
			"The purchase of this item will cost 500 cartridges and will last for 7 days.\n- **COST**: 500 " +
				CARTRIDGE_EMOJI +
				"\n- **DURATION**: 7 days\n-# By continuing, you agree to this purchase and acknowledge that no refunds will be available.",
		);

		modal
			.addLabelComponents(colorLabel, customColorLabel)
			.addTextDisplayComponents(bottomText);

		await interaction.showModal(modal);
	}
}
