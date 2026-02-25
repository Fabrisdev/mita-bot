import { client } from "./client";

export namespace Log {
	const colors = {
		reset: "\x1b[0m",
		gray: "\x1b[90m",
		blue: "\x1b[34m",
	};
	const BOT_OWNER_ID = "317105612100075520";

	export async function error(...data: unknown[]) {
		const botOwner = await client.users.fetch(BOT_OWNER_ID);
		const message = data.join(" ");
		await botOwner.send(message);
		console.error(message);
	}
	export async function log(...data: unknown[]) {
		const now = new Date();

		const hours = now.getHours().toString().padStart(2, "0");
		const minutes = now.getMinutes().toString().padStart(2, "0");
		const seconds = now.getSeconds().toString().padStart(2, "0");

		const timestamp = `${colors.gray}[${hours}:${minutes}:${seconds}]${colors.reset}`;
		const level = `${colors.blue}[INFO]${colors.reset}`;

		console.log(timestamp, level, ...data);
	}
}
