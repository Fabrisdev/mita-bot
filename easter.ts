import path from "node:path";
import type { Guild } from "discord.js";
import { client } from "./client";
import { guildId } from "./environment";
import { cycle } from "./utils";

const images = cycle(["Cappie", "Kind", "Mila", "Mita", "Short"]);
const trackedMessages = new Set<string>();

export async function setupEasterEvent() {
	const FIFTEEN_MINUTES = 15 * 60 * 1000;
	const guild = await client.guilds.fetch(guildId());
	setInterval(() => postEgg(guild), FIFTEEN_MINUTES);
}

async function postEgg(guild: Guild) {
	const PROHIBITED_CATEGORY = "1369447930905366620";
	const channel = guild.channels.cache
		.filter((channel) => channel.isSendable())
		.filter((channel) => channel.parentId !== PROHIBITED_CATEGORY)
		.random();
	if (channel === undefined) return;
	const filename = `Choco${images.next().value}.png`;
	const imagePath = path.join("assets", filename);
	const message = await channel.send({
		files: [imagePath],
	});
	trackedMessages.add(message.id);
}

export function isEgg(messageId: string) {
	return trackedMessages.has(messageId);
}
