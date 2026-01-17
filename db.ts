import { ConvexClient } from "convex/browser";
import { api } from "./convex/_generated/api";
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
