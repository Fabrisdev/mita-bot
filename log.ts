import { client } from "./client";

export namespace Log {
	const userId = "317105612100075520";
	export async function error(...message: unknown[]) {
		const user = await client.users.fetch(userId);
		await user.send(message.join(" "));
		console.error(message);
	}
}
