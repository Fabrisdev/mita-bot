import type { Client } from "discord.js";

export default async (client: Client<true>) => {
	console.log(`Logged in as ${client.user.tag}!`);
};
