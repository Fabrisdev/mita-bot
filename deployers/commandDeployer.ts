import { REST, Routes, SlashCommandBuilder } from "discord.js";
import { clientId, guildId, token } from "../environment";
import { fetchCommands } from "../handlers/commandHandler";

const commands = await fetchCommands();
const commandsData = Array.from(commands).map((command) =>
	new SlashCommandBuilder()
		.setName(command[0])
		.setDescription(command[1].description),
);

const rest = new REST().setToken(token());
console.log(`Started refreshing slash commands.`);
await rest.put(Routes.applicationGuildCommands(clientId(), guildId()), {
	body: commandsData,
});
console.log(`Successfully refreshed slash commands.`);
