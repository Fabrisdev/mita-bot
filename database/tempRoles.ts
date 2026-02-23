import { client } from "../client";
import { guildId } from "../environment";
import { db } from "./database";

export namespace TempRoles {
	export async function add(data: {
		userId: string;
		roleId: string;
		expiresOn: Date;
	}) {
		const [inserted] = await db
			.insertInto("temp_roles")
			.values({
				user_id: data.userId,
				role_id: data.roleId,
				expires_on: data.expiresOn,
			})
			.returning("id")
			.execute();
		if (!inserted) throw new Error("Couldn't insert into temp role");
		return inserted.id;
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
		const guild = await client.guilds.fetch(guildId()).catch(() => null);
		if (guild === null) return;
		const member = await guild.members.fetch(role.user_id).catch(() => null);
		if (member === null) return;
		await member.roles.remove(role.role_id).catch(() => null);
		console.log(`Removed role ${role.role_id} from user ${role.user_id}.`);
	}
}
