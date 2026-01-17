import { ConvexClient } from "convex/browser";
import { api } from "./convex/_generated/api";

const convex = new ConvexClient("https://brilliant-leopard-428.convex.cloud");

export async function setAlertsChannel(guildId: string, channelId: string) {
	await convex.mutation(api.functions.guildSettings.setAlertsChannel, {
		guildId,
		channelId,
	});
}

export async function getAlertsChannel(guildId: string) {
	return await convex.query(api.functions.guildSettings.getByGuild, {
		guildId,
	});
}
