import {
	type CacheType,
	type Interaction,
	PermissionsBitField,
} from "discord.js";
import { fetchCommands } from "../commands/handler";

const commands = await fetchCommands();

export default async (interaction: Interaction<CacheType>) => {
	if (!interaction.isChatInputCommand()) return;
	const command = commands.get(interaction.commandName);
	if (command === undefined) {
		console.error(
			`Interaction ${interaction.commandName} was run, but there were no commands found matching it. More info below:`,
		);
		console.error("INTERACTION COMMAND NAME:", interaction.commandName);
		console.error("COMMANDS AVAILABLE:", commands);
		return;
	}
	for (const permission of command.permissions) {
		if (!interaction.memberPermissions?.has(permission)) {
			const permissionName = permissionBitToName(permission);
			interaction.reply({
				content: `This command requires the \`${permissionName}\` permission.`,
				ephemeral: true,
			});
			return;
		}
	}
	try {
		await command.run(interaction);
	} catch (error) {
		console.error(
			`An error ocurred whilst executing ${interaction.commandName} interaction. More info below:`,
		);
		console.error(error);
		const errorMessage =
			"There was an error while executing this command. We've been notified about it and are working on fixing it.";
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp(errorMessage);
			return;
		}
		await interaction.reply(errorMessage);
	}
};

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
