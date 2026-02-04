import { ConvexClient } from "convex/browser";
import { Cache, type Ticket as TicketType } from "./cache";
import { client } from "./client";
import { api } from "./convex/_generated/api";
import type { Id } from "./convex/_generated/dataModel";
import { convexUrl } from "./environment";

const convex = new ConvexClient(convexUrl());

export async function setAlertsChannel(guildId: string, channelId: string) {
	await convex.mutation(api.functions.guildSettings.setAlertsChannel, {
		guildId,
		channelId,
	});
}

export async function getAlertsChannel(guildId: string) {
	return await convex
		.query(api.functions.guildSettings.getByGuild, {
			guildId,
		})
		.then((row) => row?.alertsChannelId);
}

export async function getUserHistory(guildId: string, userId: string) {
	return await convex
		.query(api.functions.history.getUserHistory, {
			guildId,
			userId,
		})
		.then((row) => row?.history);
}

export async function addToUserHistory(
	guildId: string,
	userId: string,
	incident: Incident,
) {
	return await convex.mutation(api.functions.history.addToUserHistory, {
		guildId,
		userId,
		incident: {
			...incident,
			at: Date.now(),
		},
	});
}

type Incident = {
	type: "ban" | "unban" | "kick" | "mute" | "warn";
	moderatorId: string;
	reason: string;
};

export namespace Ticket {
	export async function open({
		guildId,
		ownerId,
	}: {
		guildId: string;
		ownerId: string;
	}) {
		const ticket = (await convex.mutation(api.functions.tickets.openTicket, {
			guildId,
			ownerId,
		})) as TicketType;
		Cache.update("tickets", (tickets) => [...tickets, ticket]);
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

	export async function rawAll(guildId: string) {
		const cachedTickets = Cache.read("tickets");
		if (cachedTickets) return cachedTickets;
		const tickets = await convex.query(
			api.functions.tickets.getTicketsFromGuild,
			{
				guildId,
			},
		);
		Cache.store("tickets", tickets);
		return tickets;
	}

	export async function all(guildId: string) {
		const tickets = await rawAll(guildId);
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
		console.time("All");
		const tickets = await rawAll(guildId);
		console.timeEnd("All");
		const ticketIds = tickets
			.filter((ticket) => ticket.status === "open")
			.map((ticket) => ticket._id);
		console.time("Do guild stuff");
		const channels = (
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
		console.timeEnd("Do guild stuff");
		return channels;
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
