import { ChannelType } from "discord.js";
import Elysia from "elysia";
import z from "zod";
import { client } from "../client";
import { apiPort, apiSecret } from "../environment";

const sendMessageSchema = z.object({
	channelId: z.string(),
	message: z.string(),
	secret: z.string(),
});

const elysia = new Elysia()
	.get("/api/ok", "")
	.post("/api/send-message", async ({ body }) => {
		if (typeof body !== "string")
			return new Response(undefined, { status: 400 });
		let data = null;
		try {
			data = JSON.parse(body);
		} catch {
			return new Response(undefined, { status: 400 });
		}
		const parsed = sendMessageSchema.safeParse(data);
		if (parsed.error || parsed.data.secret !== apiSecret())
			return new Response(undefined, { status: 400 });
		const { channelId, message } = parsed.data;

		try {
			const channel = await client.channels.fetch(channelId);
			if (!channel || channel.type !== ChannelType.GuildText)
				return new Response(undefined, { status: 400 });
			channel.send(message);
		} catch {
			return new Response(undefined, { status: 400 });
		}
	});

export function startApiService() {
	const port = apiPort();
	elysia.listen(port);
	console.log("API service listening at:", port);
}
