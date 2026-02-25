import {
	InteractionContextType,
	REST,
	Routes,
	SlashCommandBuilder,
} from "discord.js";
import { clientId, guildId, token } from "../environment";
import { Log } from "../log";
import { fetchCommands } from "./handler";

const setGlobally = process.argv.includes("--global");

const commands = await fetchCommands();
const commandsData = Array.from(commands).map(([name, command]) => {
	const combined = command.permissions.reduce((acc, perm) => acc | perm, 0n);
	const permissions = combined === 0n ? null : combined;
	const builder = new SlashCommandBuilder()
		.setName(name)
		.setDescription(command.description)
		.setDefaultMemberPermissions(permissions)
		.setContexts(
			command.environment === "guild"
				? InteractionContextType.Guild
				: InteractionContextType.BotDM,
		);
	if (!command.options) return builder;

	const json = builder.toJSON();
	//@ts-expect-error This is not an actual error, rather Typescript not being able to confirm that the two types are actually the same.
	json.options = command.options;
	return json;
});

const rest = new REST().setToken(token());
Log.log(
	`Started refreshing slash commands ${setGlobally ? "GLOBALLY" : "on the server"}.`,
);
const route = setGlobally
	? Routes.applicationCommands(clientId())
	: Routes.applicationGuildCommands(clientId(), guildId());
await rest.put(route, {
	body: commandsData,
});
Log.log(
	`Successfully refreshed slash commands ${setGlobally ? "GLOBALLY" : "on the server"}.`,
);
process.exit(0);
