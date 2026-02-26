import { client } from "./client";

export namespace Log {
	const colors = {
		reset: "\x1b[0m",
		gray: "\x1b[90m",
		blue: "\x1b[34m",
		green: "\x1b[32m",
		yellow: "\x1b[33m",
	};
	const BOT_OWNER_ID = "317105612100075520";

	export async function error(...data: unknown[]) {
		const botOwner = await client.users.fetch(BOT_OWNER_ID);
		const message = data.join(" ");
		console.error(message);
		await botOwner.send(message);
	}
	export async function errorWithoutMessaging(...data: unknown[]) {
		const message = data.join(" ");
		console.error(message);
	}
	export async function log(...data: unknown[]) {
		logLevel("info", ...data);
	}
	export async function success(...data: unknown[]) {
		logLevel("success", ...data);
	}

	export async function warn(...data: unknown[]) {
		logLevel("warn", ...data);
	}

	function logLevel(level: "info" | "success" | "warn", ...data: unknown[]) {
		const now = new Date();

		const hours = now.getHours().toString().padStart(2, "0");
		const minutes = now.getMinutes().toString().padStart(2, "0");
		const seconds = now.getSeconds().toString().padStart(2, "0");

		const timestamp = `${colors.gray}[${hours}:${minutes}:${seconds}]${colors.reset}`;

		let levelTag: string;

		if (level === "success") {
			levelTag = `${colors.green}[SUCCESS]${colors.reset}`;
		} else if (level === "warn") {
			levelTag = `${colors.yellow}[WARN]${colors.reset}`;
		} else {
			levelTag = `${colors.blue}[INFO]${colors.reset}`;
		}

		console.log(timestamp, levelTag, ...data);
	}
}
