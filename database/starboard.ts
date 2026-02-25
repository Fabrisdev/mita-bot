import { db } from "./database";

export namespace Starboard {
	export async function add(data: {
		messageId: string;
		starboardMessageId: string;
	}) {
		await db
			.insertInto("starboard")
			.values({
				message_id: data.messageId,
				starboard_message_id: data.starboardMessageId,
			})
			.execute();
	}

	export function isAlreadyThere(messageId: string) {
		return db
			.selectFrom("starboard")
			.selectAll()
			.where("message_id", "=", messageId)
			.executeTakeFirst();
	}
}
