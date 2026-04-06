import { db } from "./database";

async function add(userId: string, amount: number) {
	await db
		.insertInto("eggs")
		.values({ user_id: userId, amount })
		.onConflict((oc) =>
			oc.column("user_id").doUpdateSet((eb) => ({
				amount: eb("eggs.amount", "+", amount),
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
			add: () => add(userId, 1),
			addBy: (amount: number) => add(userId, amount),
			query: () => query(userId),
		};
	}

	export async function leaderboard() {
		return await db
			.selectFrom("eggs")
			.selectAll()
			.orderBy("amount", "desc")
			.limit(10)
			.execute();
	}
}
