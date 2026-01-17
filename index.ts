import { Client, GatewayIntentBits } from "discord.js";
import { token } from "./environment";
import { registerEvents } from "./events/register";

export const client = new Client({ intents: [GatewayIntentBits.Guilds] });
await registerEvents();
client.login(token());
