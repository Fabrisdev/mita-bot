import { REST, Routes, SlashCommandBuilder } from "discord.js";
import { clientId, guildId, token } from "../environment";
import { fetchCommands } from "./handler";

const setGlobally = process.argv.includes("--global");

const commands = await fetchCommands();
const commandsData = Array.from(commands).map(([name, command]) => {
	const builder = new SlashCommandBuilder()
		.setName(name)
		.setDescription(command.description);
	if (!command.options) return builder;

	const json = builder.toJSON();
	//@ts-expect-error This is not an actual error, rather Typescript not being able to confirm that the two types are actually the same.
	json.options = command.options;
	return json;
});

const rest = new REST().setToken(token());
console.log(
	`Started refreshing slash commands ${setGlobally ? "GLOBALLY" : "on the testing server"}.`,
);
const route = setGlobally
	? Routes.applicationCommands(clientId())
	: Routes.applicationGuildCommands(clientId(), guildId());
await rest.put(route, {
	body: commandsData,
});
console.log(
	`Successfully refreshed slash commands ${setGlobally ? "GLOBALLY" : "on the testing server"}.`,
);
process.exit(0);
