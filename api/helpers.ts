import { PermissionFlagsBits } from "discord.js";
import { t } from "elysia";
import { client } from "../client";

export async function isAdminAt(guildId: string, userId: string) {
	const guild = await client.guilds.fetch(guildId).catch(() => null);
	if (!guild) return false;

	const member = await guild.members.fetch(userId).catch(() => null);
	if (!member) return false;

	return member.permissions.has(PermissionFlagsBits.Administrator);
}

export const GuildIdGuard = {
	params: t.Object({
		guildId: t.String(),
	}),
};
