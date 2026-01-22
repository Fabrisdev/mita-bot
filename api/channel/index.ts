import Elysia, { t } from "elysia";
import { ChannelModel } from "./model";
import { ChannelService } from "./service";

export const ChannelController = new Elysia({ prefix: "/channel" })
	.guard({
		params: t.Object({
			guildId: t.String(),
		}),
	})
	.post("/send", ({ body }) => ChannelService.send(body), {
		body: ChannelModel.SendBody,
	})
	.get("/", ({ params }) => ChannelService.getAll({ guildId: params.guildId }));
