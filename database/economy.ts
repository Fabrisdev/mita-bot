import { db } from "./database";

async function addMoney(userId: string) {
	const incrementBy = randomInt(5, 10);
	await db
		.insertInto("economy")
		.values({ user_id: userId, amount: incrementBy })
		.onConflict((oc) =>
			oc.column("user_id").doUpdateSet((eb) => ({
				amount: eb("economy.amount", "+", incrementBy),
			})),
		)
		.execute();
}

async function queryAmount(userId: string) {
	return await db
		.selectFrom("economy")
		.select("amount")
		.where("user_id", "=", userId)
		.executeTakeFirst()
		.then((rows) => rows?.amount ?? 0);
}

export namespace Economy {
	export function of(userId: string) {
		return {
			addMoney: () => addMoney(userId),
			queryAmount: () => queryAmount(userId),
		};
	}
}

function randomInt(a: number, b: number) {
	return Math.floor(Math.random() * (b - a + 1)) + a;
}
