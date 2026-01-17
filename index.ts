import { Client, Events, GatewayIntentBits } from "discord.js";
import { token } from "./environment";
import { registerEvents } from "./events/register";

export const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.once(Events.ClientReady, (client) => {
	console.log(`Logged in as ${client.user.tag}!`);
});

await registerEvents();

client.login(token());
