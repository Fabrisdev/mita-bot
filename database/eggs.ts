import { db } from "./database";

async function add(userId: string) {
	await db
		.insertInto("eggs")
		.values({ user_id: userId, amount: 1 })
		.onConflict((oc) =>
			oc.column("user_id").doUpdateSet((eb) => ({
				amount: eb("eggs.amount", "+", 1),
			})),
		)
		.execute();
}

async function query(userId: string) {
	return await db
		.selectFrom("eggs")
		.select("amount")
		.where("user_id", "=", userId)
		.executeTakeFirst()
		.then((rows) => rows?.amount ?? 0);
}

export namespace Eggs {
	export function of(userId: string) {
		return {
			add: () => add(userId),
			query: () => query(userId),
		};
	}
}
