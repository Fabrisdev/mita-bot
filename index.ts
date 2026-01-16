import { Client, Events, GatewayIntentBits } from "discord.js";
import { fetchCommands } from "./handlers/commandHandler";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.once(Events.ClientReady, (client) => {
	console.log(`Logged in as ${client.user.tag}!`);
});

const commands = await fetchCommands();
client.on(Events.InteractionCreate, async (interaction) => {
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
	try {
		await command.run(interaction);
	} catch (error) {
		console.error(
			`An error ocurred whilst executing ${interaction.commandName} interaction. More info below:`,
		);
		console.error(error);
		const errorMessage =
			"There was an error while executing this command. We've been notified about and are working on fixing it.";
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp(errorMessage);
			return;
		}
		await interaction.reply(errorMessage);
	}
});

const token = process.env.DISCORD_BOT_TOKEN;
if (token === undefined) {
	console.log(
		"Missing discord bot token. Did you made sure to create a .env and include all needed fields?",
	);
	process.exit(1);
}
client.login(token);
