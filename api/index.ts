import { bearer } from "@elysiajs/bearer";
import { ChannelType } from "discord.js";
import Elysia, { status, t } from "elysia";
import { client } from "../client";
import { apiPort, apiSecret } from "../environment";

const sendMessageSchema = t.Object({
	channelId: t.String(),
	message: t.String(),
});

const elysia = new Elysia({ prefix: "/api" })
	.use(bearer())
	.onBeforeHandle(({ bearer }) => {
		if (!bearer || bearer !== apiSecret()) return status("Unauthorized");
	})
	.get("/ok", "")
	.post(
		"/send-message",
		async ({ body }) => {
			const { channelId, message } = body;

			try {
				const channel = await client.channels.fetch(channelId);
				if (!channel || channel.type !== ChannelType.GuildText)
					return status("Bad Request");

				channel.send(message);
			} catch {
				return status("Bad Request");
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
