import { db } from "./database";

export namespace History {
	export async function fromUser(userId: string) {
		return await db
			.selectFrom("history")
			.select(["at", "moderator_id", "reason", "type"])
			.where("user_id", "=", userId)
			.execute();
	}

	export async function addToUser(userId: string, incident: Incident) {
		await db
			.insertInto("history")
			.values({
				user_id: userId,
				type: incident.type,
				moderator_id: incident.moderatorId,
				reason: incident.reason,
			})
			.execute();
	}

	type Incident = {
		type: "ban" | "unban" | "kick" | "timeout" | "warn";
		moderatorId: string;
		reason: string;
	};
}
