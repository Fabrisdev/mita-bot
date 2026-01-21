import { bearer } from "@elysiajs/bearer";
import { ChannelType } from "discord.js";
import Elysia, { t } from "elysia";
import { client } from "../client";
import { apiPort, apiSecret } from "../environment";

const sendMessageSchema = t.Object({
	channelId: t.String(),
	message: t.String(),
});

const elysia = new Elysia()
	.use(bearer())
	.get("/api/ok", "")
	.post(
		"/api/send-message",
		async ({ bearer, body, set }) => {
			if (!bearer || bearer !== apiSecret()) {
				set.status = "Unauthorized";
				return;
			}

			const { channelId, message } = body;

			try {
				const channel = await client.channels.fetch(channelId);
				if (!channel || channel.type !== ChannelType.GuildText) {
					set.status = "Bad Request";
					return;
				}

				channel.send(message);
			} catch {
				set.status = "Bad Request";
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
