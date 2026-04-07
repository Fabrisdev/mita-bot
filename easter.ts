import path from "node:path";
import { ChannelType, type Guild, PermissionsBitField } from "discord.js";
import { client } from "./client";
import { guildId } from "./environment";
import { Log } from "./log";
import { cycle } from "./utils";

const images = cycle(["Cappie", "Kind", "Mila", "Mita", "Short"]);
type TrackedMessage = {
	type: "normal" | "golden" | "zombie";
};
const trackedMessages = new Map<string, TrackedMessage>();

export async function setupEasterEvent() {
	Log.success("Easter event started!");
	const THIRTY_SECONDS = 0.5 * 60 * 1000;
	const guild = await client.guilds.fetch(guildId());
	setInterval(() => postEgg(guild), THIRTY_SECONDS);
}

async function postEgg(guild: Guild) {
	const MAX_EGGS_AMOUNT = 3;
	if (
		Array.from(trackedMessages.values()).filter((m) => m.type !== "zombie")
			.length > MAX_EGGS_AMOUNT
	)
		return;
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
			return (
				perms?.has(PermissionsBitField.Flags.ViewChannel) &&
				perms?.has(PermissionsBitField.Flags.SendMessages) &&
				perms?.has(PermissionsBitField.Flags.AttachFiles)
			);
		})
		.random();
	if (channel === undefined) return;
	if (Math.random() >= 0.95) {
		const imagePath = path.join("assets", "ZombieMita.png");
		Log.log(`Trying to post a ZOMBIE EGG in ${channel.id}...`);
		const message = await channel.send({
			files: [imagePath],
		});
		Log.log(`Posted ZOMBIE EGG in ${channel.id}!`);
		trackedMessages.set(message.id, { type: "zombie" });
		return;
	}
	if (Math.random() <= 0.05) {
		const imagePath = path.join("assets", "GoldenCappie.png");
		Log.log(`Trying to post a GOLDEN EGG in ${channel.id}...`);
		const message = await channel.send({
			content: "A **GOLDEN EGG**??!!! **X10 VALUE**",
			files: [imagePath],
		});
		Log.log(`Posted GOLDEN EGG in ${channel.id}!`);
		trackedMessages.set(message.id, { type: "golden" });
		return;
	}
	const filename = `Choco${images.next().value}.png`;
	const imagePath = path.join("assets", filename);
	Log.log(`Trying to post an egg in ${channel.id}...`);
	const message = await channel.send({
		files: [imagePath],
	});
	Log.log(`Posted an egg in ${channel.id}!`);
	trackedMessages.set(message.id, { type: "normal" });
}

export function isEgg(messageId: string, deleteAfterChecking?: boolean) {
	const egg = trackedMessages.get(messageId);
	if (egg && deleteAfterChecking) {
		trackedMessages.delete(messageId);
	}
	return egg;
}
