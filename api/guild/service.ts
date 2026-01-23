import { client } from "../../client";
import type { GuildModel } from "./model";

export namespace GuildService {
	export async function getAll({ userId }: GuildModel.GetAll) {
		const guilds = await Promise.all(
			client.guilds.cache.map(async (guild) => {
				const isMember = guild.members.fetch(userId).catch(() => false);
				if (!isMember) return null;
				return {
					name: guild.name,
					id: guild.id,
					icon: guild.iconURL(),
				};
			}),
		);
		return guilds.filter(Boolean);
	}
}
