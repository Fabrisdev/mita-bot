import { ChannelType } from "discord.js";
import Elysia, { t } from "elysia";
import { client } from "../client";
import { apiPort, apiSecret } from "../environment";

const sendMessageSchema = t.Object({
	channelId: t.String(),
	message: t.String(),
	secret: t.String(),
});

const elysia = new Elysia().get("/api/ok", "").post(
	"/api/send-message",
	async ({ body }) => {
		if (body.secret !== apiSecret())
			return new Response(undefined, { status: 400 });
		const { channelId, message } = body;

		try {
			const channel = await client.channels.fetch(channelId);
			if (!channel || channel.type !== ChannelType.GuildText)
				return new Response(undefined, { status: 400 });
			channel.send(message);
		} catch {
			return new Response(undefined, { status: 400 });
		}
	},
	{
		body: sendMessageSchema,
	},
);

export function startApiService() {
	const port = apiPort();
	elysia.listen(port);
	console.log("API service listening at:", port);
}
