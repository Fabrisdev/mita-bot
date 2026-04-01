import type { Message } from "discord.js";
import { Economy } from "../../database/economy";

const COOLDOWN_TIME = 60_000;
const lastUsed = new Map<string, number>();

export default async (message: Message) => {
	if (message.author.bot) return;
	const userId = message.author.id;
	const economy = Economy.of(userId);
	const lastUsedAt = lastUsed.get(userId);
	if (lastUsedAt && lastUsedAt + COOLDOWN_TIME > Date.now()) return;
	lastUsed.set(userId, Date.now());
	economy.addMoney();
};
