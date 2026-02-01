import { ConvexClient } from "convex/browser";
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
		messages,
	}: {
		ticketId: Id<"tickets">;
		messages: {
			authorId: string;
			content: string;
			sentAt: number;
		}[];
	}) {
		return await convex.mutation(api.functions.ticketMessages.storeMessages, {
			messages,
			ticketId,
		});
	}
}
