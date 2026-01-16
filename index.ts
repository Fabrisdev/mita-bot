import { Client, Events, GatewayIntentBits } from "discord.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.once(Events.ClientReady, (client) => {
	console.log(`Logged in as ${client.user.tag}!`);
});

const token = process.env.DISCORD_BOT_TOKEN;
if (token === undefined) {
	console.log(
		"Missing discord bot token. Did you made sure to create a .env and include all needed fields?",
	);
	process.exit(1);
}
client.login(token);
