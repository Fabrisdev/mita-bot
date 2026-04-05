import path from "node:path";
import type { Guild } from "discord.js";
import { client } from "./client";
import { guildId } from "./environment";
import { cycle } from "./utils";

const images = cycle(["Cappie", "Kind", "Mila", "Mita", "Short"]);

export async function setupEasterEvent() {
	const FIFTEEN_MINUTES = 15 * 60 * 1000;
	const guild = await client.guilds.fetch(guildId());
	setInterval(() => postEgg(guild), FIFTEEN_MINUTES);
}

function postEgg(guild: Guild) {
	const channel = guild.channels.cache
		.filter((channel) => channel.isSendable())
		.random();
	if (channel === undefined) return;
	const filename = `Choco${images.next().value}.png`;
	const imagePath = path.join("assets", filename);
	channel.send({
		files: [imagePath],
	});
}
