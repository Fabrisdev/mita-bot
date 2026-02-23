import { ChannelType, type Message } from "discord.js";
import { evaluate } from "mathjs";
import { Counting } from "../commands/counting";
import { generateTomatoImage } from "../commands/tomato.command";
import { cycle } from "../utils";

export default async (message: Message) => {
	CountingSystem.run(message);
};

export namespace CountingSystem {
	const positiveReactions = cycle(["✅", "⭐", "🔥", "🗣️"] as const);
	export async function run(message: Message) {
		if (!message.guild) return;
		if (message.channel.type !== ChannelType.GuildText) return;
		if (message.author.bot) return;
		const guildId = message.guild.id;
		const data = await Counting.get(guildId);
		if (data === null) return;
		if (message.channel.id !== data.channelId) return;

		const { content } = message;
		const nextNumber = data.currentNumber + 1;
		const result = tryEvaluate(content);
		if (result === null) return;
		if (result !== nextNumber) {
			await message.react("🍅");
			data.currentNumber = 0;
			const image = await generateTomatoImage(message.author);
			await message.reply({
				content: `${message.author} **RUINED IT AT ${nextNumber}**!! 🍅 🍅 🍅 Let's start again from 1...
-# (Just in case, they sent: ${result}) `,
				files: [image],
			});
			return;
		}
		if (data.lastSenderId === message.author.id) {
			if (message.deletable) message.delete();
			return;
		}
		data.lastSenderId = message.author.id;
		data.currentNumber += 1;
		await message.react(positiveReactions.next().value);
	}
}

function tryEvaluate(input: string) {
	try {
		const result = evaluate(input);

		if (typeof result === "number" && Number.isFinite(result)) {
			return result;
		}

		return null;
	} catch {
		return null;
	}
}
