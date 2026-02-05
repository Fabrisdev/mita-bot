import { client } from "./client";

export namespace Log {
	const userId = "317105612100075520";
	export async function error(...data: unknown[]) {
		const user = await client.users.fetch(userId);
		const message = data.join(" ");
		await user.send(message);
		console.error(message);
	}
}
