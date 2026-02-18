import {
	ActionRowBuilder,
	ButtonBuilder,
	type ButtonInteraction,
	type CacheType,
	type ChatInputCommandInteraction,
	ComponentType,
	type Interaction,
	MessageFlags,
	PermissionsBitField,
} from "discord.js";
import { fetchCommands } from "../commands/handler";
import { Ticket } from "../db";
import { Log } from "../log";

const commands = await fetchCommands();

export default async (interaction: Interaction<CacheType>) => {
	if (interaction.isButton()) return await handleButtonInteraction(interaction);
	if (interaction.isChatInputCommand())
		return await handleChatInputCommand(interaction);
};

async function handleButtonInteraction(
	interaction: ButtonInteraction<CacheType>,
) {
	if (interaction.customId.startsWith("close-ticket:")) {
		await closeTicketButtonInteraction(interaction);
		return;
	}
	if (
		interaction.customId.startsWith("accept-marry:") ||
		interaction.customId.startsWith("reject-marry:")
	) {
		const proposer = interaction.customId.split(":")[1] as string;
		const expectedReplier = interaction.customId.split(":")[2] as string;
		if (expectedReplier !== interaction.user.id) {
			await interaction.reply({
				content: `Only <@${expectedReplier}> can reply to this!`,
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		const rows = interaction.message.components.map((row) => {
			if (row.type !== ComponentType.ActionRow) return row;

			const buttons = row.components
				.filter((c) => c.type === ComponentType.Button)
				.map((button) => ButtonBuilder.from(button).setDisabled(true));

			return new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);
		});
		await interaction.update({
			components: rows,
		});
		if (interaction.customId.startsWith("accept-marry:")) {
			await acceptMarryButtonInteraction(interaction, proposer);
			return;
		}
		await rejectMarryButtonInteraction(interaction, proposer);
		return;
	}
}

async function acceptMarryButtonInteraction(
	interaction: ButtonInteraction<CacheType>,
	proposer: string,
) {
	await interaction.followUp(
		`${interaction.user} **ACCEPTED!!** 💍💐 <@${proposer}> and ${interaction.user} are now **MARRIED**!`,
	);
	const proposerMember = await interaction.guild?.members
		.fetch(proposer)
		.catch(() => null);
	if (proposerMember) {
		const currentNickname =
			proposerMember.nickname ?? proposerMember.user.username;
		proposerMember.setNickname(`${currentNickname} 💍`).catch(() => null);
	}
	const member = await interaction.guild?.members
		.fetch(interaction.user)
		.catch(() => null);
	if (member) {
		const currentNickname = member.nickname ?? member.user.username;
		member.setNickname(`${currentNickname} 💍`).catch(() => null);
	}
}

async function rejectMarryButtonInteraction(
	interaction: ButtonInteraction<CacheType>,
	proposer: string,
) {
	await interaction.followUp(
		`${interaction.user} **REJECTED** <@${proposer}>!! Ouch.. that must have hurt.`,
	);
}

async function closeTicketButtonInteraction(
	interaction: ButtonInteraction<CacheType>,
) {
	const id = Number(interaction.customId.split(":")[1]);
	await Ticket.close(id);
	await interaction.channel?.delete();
}

async function handleChatInputCommand(
	interaction: ChatInputCommandInteraction<CacheType>,
) {
	const command = commands.get(interaction.commandName);
	if (command === undefined) {
		await Log.error(
			`Interaction ${interaction.commandName} was run, but there were no commands found matching it. More info below:`,
		);
		await Log.error("INTERACTION COMMAND NAME:", interaction.commandName);
		await Log.error("COMMANDS AVAILABLE:", commands);
		return;
	}
	for (const permission of command.permissions) {
		if (!interaction.memberPermissions?.has(permission)) {
			const permissionName = permissionBitToName(permission);
			interaction.reply({
				content: `This command requires the \`${permissionName}\` permission.`,
				flags: MessageFlags.Ephemeral,
			});
			return;
		}
	}
	if (command.environment === "guild" && interaction.guild === null) {
		await interaction.reply({
			content: "This command can only be run inside the server.",
			flags: MessageFlags.Ephemeral,
		});
		return;
	}
	if (command.environment === "dm" && interaction.guild) {
		await interaction.reply({
			content: "This command can only be run on DMs.",
			flags: MessageFlags.Ephemeral,
		});
		return;
	}
	try {
		await command.run(interaction);
	} catch (error) {
		Log.error(
			`An error ocurred whilst executing ${interaction.commandName} interaction. More info below:`,
		);
		Log.error(error);
		const errorMessage =
			"There was an error while executing this command. We've been notified about it and are working on fixing it.";
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp(errorMessage);
			return;
		}
		await interaction.reply(errorMessage);
	}
}

function permissionBitToName(permission: bigint) {
	const name =
		Object.entries(PermissionsBitField.Flags).find(
			([, value]) => value === permission,
		)?.[0] ?? "Unknown permission";
	return prettifyPermissionName(name);
}

function prettifyPermissionName(name: string) {
	return name.replace(/([A-Z])/g, " $1").trim();
}
