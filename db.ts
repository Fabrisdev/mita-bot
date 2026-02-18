import { sql } from "bun";
import { ConvexClient } from "convex/browser";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { client } from "./client";
import { CountingCache } from "./commands/counting";
import { api } from "./convex/_generated/api";
import type { Id } from "./convex/_generated/dataModel";
import type { DB } from "./db.types";
import { convexUrl } from "./environment";

const convex = new ConvexClient(convexUrl());

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
	export async function findByChannelName({
		guildId,
		channelName,
	}: {
		guildId: string;
		channelName: string;
	}) {
		const ticket = await convex.query(
			api.functions.tickets.getTicketByChannelName,
			{
				channelName,
			},
		);
		if (ticket === null) return null;
		if (ticket.guildId !== guildId) return null;
		return ticket;
	}

	export async function open({
		guildId,
		ownerId,
	}: {
		guildId: string;
		ownerId: string;
	}) {
		return await convex.mutation(api.functions.tickets.openTicket, {
			guildId,
			ownerId,
		});
	}
	export async function close(ticketId: Id<"tickets">) {
		return await convex.mutation(api.functions.tickets.closeTicket, {
			ticketId,
		});
	}
	export async function store({
		ticketId,
		message,
	}: {
		ticketId: Id<"tickets">;
		message: {
			authorId: string;
			content: string;
			sentAt: number;
		};
	}) {
		return await convex.mutation(api.functions.ticketMessages.storeMessage, {
			message,
			ticketId,
		});
	}

	export async function all(guildId: string) {
		const tickets = await convex.query(
			api.functions.tickets.getTicketsFromGuild,
			{
				guildId,
			},
		);
		const usersInfo = new Map<string, UserInfo>();
		for (const ticket of tickets) {
			for (const message of ticket.messages) {
				if (!usersInfo.has(message.authorId)) {
					const userInfo = await getUserInfo(message.authorId);
					usersInfo.set(message.authorId, userInfo);
				}
				(message as unknown as object & { user: UserInfo }).user =
					usersInfo.get(message.authorId) as UserInfo;
			}
		}
		return tickets;
	}

	export async function channelsFrom(guildId: string) {
		const tickets = await all(guildId);
		const ticketIds = tickets
			.filter((ticket) => ticket.status === "open")
			.map((ticket) => ticket._id);
		return (
			await Promise.all(
				ticketIds.flatMap(async (id) => {
					const guild = await client.guilds.fetch(guildId);
					const channel = guild.channels.cache.find(
						(channel) => channel.name === id,
					);
					if (channel) return { channelId: channel.id, ticketId: id };
					return null;
				}),
			)
		).filter((channel) => channel !== null);
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
		expiresOn: number;
	}) {
		return await convex.mutation(api.functions.tempRoles.insertTempRole, data);
	}

	async function markAsRemoved(id: Id<"tempRoles">) {
		return await convex.mutation(api.functions.tempRoles.markAsRemoved, { id });
	}

	export async function getRolesToRemove() {
		return await convex.query(api.functions.tempRoles.getRolesToRemove, {
			now: Date.now(),
		});
	}

	export async function remove(id: Id<"tempRoles">) {
		console.log(`Marked role ${id} as removed.`);
		await markAsRemoved(id);
		const role = await convex.query(api.functions.tempRoles.getRoleToRemove, {
			id,
		});
		if (role === null) return;
		const guild = await client.guilds.fetch(role.guildId).catch(() => null);
		if (guild === null) return;
		const member = await guild.members.fetch(role.userId).catch(() => null);
		if (member === null) return;
		await member.roles.remove(role.roleId).catch(() => null);
		console.log(`Removed role ${role.roleId} from user ${role.userId}.`);
	}
}

export namespace Birthday {
	export async function setChannel(data: {
		guildId: string;
		channelId: string;
	}) {
		return await convex.mutation(
			api.functions.guildSettings.setBirthdayChannel,
			data,
		);
	}

	export async function setRole(data: { guildId: string; roleId: string }) {
		return await convex.mutation(
			api.functions.guildSettings.setBirthdayRole,
			data,
		);
	}

	export async function todaysBirthdays(guildId: string) {
		const today = getToday();
		return await convex.query(api.functions.birthdays.getBirthdaysToday, {
			day: today.day,
			month: today.month,
			guildId,
		});
	}

	function getToday() {
		const now = new Date();
		return {
			year: now.getFullYear(),
			month: now.getMonth() + 1,
			day: now.getDate(),
		};
	}

	export async function updateLastCelebratedYear(id: Id<"birthdays">) {
		return await convex.mutation(
			api.functions.birthdays.updateLastCelebratedYear,
			{ id, year: new Date().getFullYear() },
		);
	}

	export async function setBirthday(data: {
		day: number;
		month: number;
		guildId: string;
		userId: string;
	}) {
		return await convex.mutation(api.functions.birthdays.setBirthday, data);
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
		return await convex.mutation(
			api.functions.guildSettings.setCountingChannel,
			data,
		);
	}
	export async function getChannel(guildId: string) {
		return await convex
			.query(api.functions.guildSettings.getByGuild, {
				guildId,
			})
			.then((row) => row?.countingChannelId);
	}
}
