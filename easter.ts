import path from "node:path";
import { ChannelType, type Guild, PermissionsBitField } from "discord.js";
import { client } from "./client";
import { guildId } from "./environment";
import { Log } from "./log";
import { cycle } from "./utils";

const images = cycle(["Cappie", "Kind", "Mila", "Mita", "Short"]);
const trackedMessages = new Set<string>();

export async function setupEasterEvent() {
	Log.success("Easter event started!");
	const TWO_MINUTES = 2 * 60 * 1000;
	const guild = await client.guilds.fetch(guildId());
	setInterval(() => postEgg(guild), TWO_MINUTES);
}

async function postEgg(guild: Guild) {
	const MAX_EGGS_AMOUNT = 3;
	if (trackedMessages.size > MAX_EGGS_AMOUNT) return;
	const PROHIBITED_CATEGORIES = [
		"1369447930905366620",
		"1369435456986550402",
		"1402078845204697242",
	];
	const channel = guild.channels.cache
		.filter((channel) => channel.type === ChannelType.GuildText)
		.filter(
			(channel) =>
				!channel.parentId || !PROHIBITED_CATEGORIES.includes(channel.parentId),
		)
		.filter((channel) => {
			const perms = channel.permissionsFor(guild.members.me!);
			return perms?.has(PermissionsBitField.Flags.SendMessages);
		})
		.random();
	if (channel === undefined) return;
	const filename = `Choco${images.next().value}.png`;
	const imagePath = path.join("assets", filename);
	const message = await channel.send({
		files: [imagePath],
	});
	trackedMessages.add(message.id);
}

export function isEgg(messageId: string, deleteAfterChecking?: boolean) {
	const isEgg = trackedMessages.has(messageId);
	if (isEgg && deleteAfterChecking) {
		trackedMessages.delete(messageId);
	}
	return isEgg;
}
