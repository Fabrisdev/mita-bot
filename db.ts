import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { client } from "./client";
import { CountingCache } from "./commands/counting";
import type { DB } from "./db.types";

const dialect = new PostgresDialect({
	pool: new Pool({
		connectionString: process.env.DATABASE_URL,
		max: 10,
	}),
});

export const db = new Kysely<DB>({
	dialect,
});

export namespace Settings {
	export async function getByGuild(guildId: string) {
		return db
			.selectFrom("guild_settings")
			.selectAll()
			.where("guild_id", "=", guildId)
			.executeTakeFirst();
	}
}

export async function setAlertsChannel(guildId: string, channelId: string) {
	await db
		.insertInto("guild_settings")
		.values({ guild_id: guildId, alerts_channel_id: channelId })
		.onConflict((oc) =>
			oc.column("guild_id").doUpdateSet({
				alerts_channel_id: channelId,
			}),
		)
		.execute();
}

export async function getAlertsChannel(guildId: string) {
	return db
		.selectFrom("guild_settings")
		.select("alerts_channel_id")
		.where("guild_id", "=", guildId)
		.executeTakeFirst()
		.then((row) => row?.alerts_channel_id);
}

export async function getUserHistory(guildId: string, userId: string) {
	return await db
		.selectFrom("history")
		.select(["at", "moderator_id", "reason", "type"])
		.where("user_id", "=", userId)
		.where("guild_id", "=", guildId)
		.execute();
}

export async function addToUserHistory(
	guildId: string,
	userId: string,
	incident: Incident,
) {
	await db
		.insertInto("history")
		.values({
			guild_id: guildId,
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

export namespace Ticket {
	export async function findByChannelId({
		guildId,
		channelId,
	}: {
		guildId: string;
		channelId: string;
	}) {
		return await db
			.selectFrom("tickets")
			.selectAll()
			.where("channel_id", "=", channelId)
			.where("guild_id", "=", guildId)
			.executeTakeFirst();
	}

	export async function open({
		guildId,
		ownerId,
		channelId,
	}: {
		guildId: string;
		channelId: string;
		ownerId: string;
	}) {
		return db
			.insertInto("tickets")
			.values({
				channel_id: channelId,
				guild_id: guildId,
				owner_id: ownerId,
			})
			.execute();
	}
	export async function close(ticketId: number) {
		return db
			.updateTable("tickets")
			.set({
				status: "closed",
			})
			.where("id", "=", ticketId)
			.execute();
	}
	export async function store({
		ticketId,
		message,
	}: {
		ticketId: number;
		message: {
			authorId: string;
			content: string;
			sentAt: Date;
		};
	}) {
		await db
			.insertInto("ticket_messages")
			.values({
				ticket_id: ticketId,
				author_id: message.authorId,
				content: message.content,
				sent_at: message.sentAt,
			})
			.execute();
	}

	export async function all(guildId: string) {
		const ticketRows = await db
			.selectFrom("tickets")
			.selectAll()
			.where("guild_id", "=", guildId)
			.execute();

		const ticketsIds = ticketRows.map((ticket) => ticket.id);
		const messages = await db
			.selectFrom("ticket_messages")
			.selectAll()
			.where("ticket_id", "in", ticketsIds)
			.execute();

		const messagesByTicket: Record<number, typeof messages> = {};

		for (const msg of messages) {
			if (!(msg.ticket_id in messagesByTicket)) {
				messagesByTicket[msg.ticket_id] = [];
			}
			//@ts-expect-error
			messagesByTicket[msg.ticket_id].push(msg);
		}

		const tickets = ticketRows.map((ticket) => ({
			...ticket,
			messages: messagesByTicket[ticket.id] || [],
		}));

		const usersInfo = new Map<string, UserInfo>();
		for (const ticket of tickets) {
			for (const message of ticket.messages) {
				if (!usersInfo.has(message.author_id)) {
					const userInfo = await getUserInfo(message.author_id);
					usersInfo.set(message.author_id, userInfo);
				}
				(message as unknown as object & { user: UserInfo }).user =
					usersInfo.get(message.author_id) as UserInfo;
			}
		}
		return tickets;
	}
}

async function getUserInfo(userId: string) {
	const user = await client.users.fetch(userId);
	return {
		name: user.username,
		icon: user.avatarURL(),
	};
}

type UserInfo = {
	icon: string | null;
	name: string;
};

export namespace TempRoles {
	export async function add(data: {
		guildId: string;
		userId: string;
		roleId: string;
		expiresOn: Date;
	}) {
		await db
			.insertInto("temp_roles")
			.values({
				guild_id: data.guildId,
				user_id: data.userId,
				role_id: data.roleId,
				expires_on: data.expiresOn,
			})
			.execute();
	}

	async function markAsRemoved(id: number) {
		await db
			.updateTable("temp_roles")
			.set("already_removed", true)
			.where("id", "=", id)
			.execute();
	}

	export async function getRolesToRemove() {
		return await db
			.selectFrom("temp_roles")
			.selectAll()
			.where("already_removed", "=", false)
			.where("expires_on", "<=", new Date(Date.now()))
			.execute();
	}

	export async function remove(id: number) {
		console.log(`Marked role ${id} as removed.`);
		await markAsRemoved(id);
		const role = await db
			.selectFrom("temp_roles")
			.selectAll()
			.where("id", "=", id)
			.executeTakeFirst();
		if (role === undefined) return;
		const guild = await client.guilds.fetch(role.guild_id).catch(() => null);
		if (guild === null) return;
		const member = await guild.members.fetch(role.user_id).catch(() => null);
		if (member === null) return;
		await member.roles.remove(role.role_id).catch(() => null);
		console.log(`Removed role ${role.role_id} from user ${role.user_id}.`);
	}
}

export namespace Birthday {
	export async function setChannel(data: {
		guildId: string;
		channelId: string;
	}) {
		await db
			.insertInto("guild_settings")
			.values({
				guild_id: data.guildId,
				birthday_channel_id: data.channelId,
			})
			.onConflict((oc) =>
				oc.column("guild_id").doUpdateSet({
					birthday_channel_id: data.channelId,
				}),
			)
			.execute();
	}

	export async function setRole(data: { guildId: string; roleId: string }) {
		await db
			.insertInto("guild_settings")
			.values({
				guild_id: data.guildId,
				birthday_role_id: data.roleId,
			})
			.onConflict((oc) =>
				oc.column("guild_id").doUpdateSet({
					birthday_role_id: data.roleId,
				}),
			)
			.execute();
	}

	export async function todaysBirthdays(guildId: string) {
		const today = getToday();
		return await db
			.selectFrom("birthdays")
			.selectAll()
			.where("day", "=", today.day)
			.where("month", "=", today.month)
			.where("guild_id", "=", guildId)
			.execute();
	}

	function getToday() {
		const now = new Date();
		return {
			year: now.getFullYear(),
			month: now.getMonth() + 1,
			day: now.getDate(),
		};
	}

	export async function updateLastCelebratedYear({
		guildId,
		userId,
	}: {
		guildId: string;
		userId: string;
	}) {
		await db
			.updateTable("birthdays")
			.set("last_celebrated_year", new Date().getFullYear())
			.where("guild_id", "=", guildId)
			.where("user_id", "=", userId)
			.execute();
	}

	export async function setBirthday(data: {
		day: number;
		month: number;
		guildId: string;
		userId: string;
	}) {
		await db
			.insertInto("birthdays")
			.values({
				day: data.day,
				month: data.month,
				guild_id: data.guildId,
				user_id: data.userId,
			})
			.onConflict((oc) =>
				oc.columns(["guild_id", "user_id"]).doUpdateSet({
					day: data.day,
					month: data.month,
				}),
			)
			.execute();
	}
}

export namespace CountingDB {
	export async function setChannel(data: {
		guildId: string;
		channelId: string;
	}) {
		CountingCache.set(data.guildId, {
			channelId: data.channelId,
			currentNumber: 0,
			lastSenderId: "",
		});

		await db
			.insertInto("guild_settings")
			.values({
				guild_id: data.guildId,
				counting_channel_id: data.channelId,
			})
			.onConflict((oc) =>
				oc.column("guild_id").doUpdateSet({
					counting_channel_id: data.channelId,
				}),
			)
			.execute();
	}
	export async function getChannel(guildId: string) {
		return db
			.selectFrom("guild_settings")
			.select("counting_channel_id")
			.where("guild_id", "=", guildId)
			.executeTakeFirst()
			.then((row) => row?.counting_channel_id);
	}
}
