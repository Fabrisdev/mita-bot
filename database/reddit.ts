import { db } from "./database";

export namespace Reddit {
	/**
	 *
	 * @param postId The post's id.
	 * @returns True if it wasnt sent already (Marked as sent succesfully). Otherwise, false.
	 */
	export async function markAsSentIfNew(postId: string) {
		const data = await db
			.insertInto("already_sent_reddit_posts")
			.values({ id: postId })
			.onConflict((oc) => oc.doNothing())
			.returning("id")
			.executeTakeFirst();
		return !!data;
	}
}
