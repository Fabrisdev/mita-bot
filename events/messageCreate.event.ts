import type { Message } from "discord.js";
import countingSystem from "./messageCreate/counting.system";
import economySystem from "./messageCreate/economy.system";
import replySystem from "./messageCreate/reply.system";

export default async (message: Message) => {
	replySystem(message);
	countingSystem(message);
	economySystem(message);
};
