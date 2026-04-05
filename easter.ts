import path from "node:path";
import { client } from "./client";
import { guildId } from "./environment";
import { cycle } from "./utils";

const guild = await client.guilds.fetch(guildId());
const images = cycle(["Cappie", "Kind", "Mila", "Mita", "Short"]);

export function setupEasterEvent() {
	const FIFTEEN_MINUTES = 15 * 60 * 1000;
	setInterval(postEgg, FIFTEEN_MINUTES);
}

function postEgg() {
	const channel = guild.channels.cache
		.filter((channel) => channel.isSendable())
		.random();
	if (channel === undefined) return;
	const filename = `${images.next().value}.png`;
	const imagePath = path.join("assets", filename);
	channel.send({
		files: [imagePath],
	});
}
