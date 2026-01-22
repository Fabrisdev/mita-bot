import { ChannelType } from "discord.js";
import { status } from "elysia";
import { client } from "../../client";
import type { UserData } from "../types";
import type { ChannelModel } from "./model";

export namespace ChannelService {
	export async function send({ channelId, message }: ChannelModel.SendBody) {
		try {
			const channel = await client.channels.fetch(channelId);
			if (!channel || channel.type !== ChannelType.GuildText)
				throw status("Bad Request");
			channel.send(message);
		} catch {
			return status("Bad Request");
		}
	}

	export async function getAll({
		guildId,
	}: ChannelModel.GetAllParams & UserData) {
		const guild = await client.guilds.fetch(guildId).catch(() => null);
		if (guild === null) return status("Bad Request");
		const channels = guild.channels.cache.map((channel) => ({
			id: channel.id,
			name: channel.name,
		}));
		return JSON.stringify(channels);
	}
}
