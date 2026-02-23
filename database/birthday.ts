import { db } from "./database";

export namespace Birthday {
	export async function todaysBirthdays() {
		const today = getToday();
		return await db
			.selectFrom("birthdays")
			.selectAll()
			.where("day", "=", today.day)
			.where("month", "=", today.month)
			.execute();
	}

	function getToday() {
		const now = new Date();
		return {
			year: now.getFullYear(),
			month: now.getMonth() + 1,
			day: now.getDate(),
		};
	}

	export async function updateLastCelebratedYear(userId: string) {
		await db
			.updateTable("birthdays")
			.set("last_celebrated_year", new Date().getFullYear())
			.where("user_id", "=", userId)
			.execute();
	}

	export async function setBirthday(data: {
		day: number;
		month: number;
		guildId: string;
		userId: string;
	}) {
		await db
			.insertInto("birthdays")
			.values({
				day: data.day,
				month: data.month,
				user_id: data.userId,
			})
			.onConflict((oc) =>
				oc.column("user_id").doUpdateSet({
					day: data.day,
					month: data.month,
				}),
			)
			.execute();
	}
}
