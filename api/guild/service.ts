import { client } from "../../client";
import { isAdminAt } from "../helpers";
import type { GuildModel } from "./model";

export namespace GuildService {
	export async function getAll({ userId }: GuildModel.GetAll) {
		const guilds = await Promise.all(
			client.guilds.cache.map(async (guild) => {
				const member = await guild.members.fetch(userId).catch(() => null);
				if (!member) return null;
				if (!isAdminAt(guild.id, userId)) return null;
				return {
					name: guild.name,
					id: guild.id,
					icon: guild.iconURL(),
					banner: guild.bannerURL(),
					memberCount: guild.memberCount,
					highestRole: member.roles.highest.name,
				};
			}),
		);
		return guilds.filter(Boolean);
	}
}
