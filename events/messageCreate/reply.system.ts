import type { Message } from "discord.js";
import { cycle } from "../../utils";

const replies = cycle(["Yes?", "What's up?", "Huh?", "What?", "Hi!", "Hello!"]);
export default (message: Message) => {
	if (message.mentions.has(message.client.user)) {
		message.reply(replies.next().value);
	}
};
