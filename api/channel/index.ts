import bearer from "@elysiajs/bearer";
import Elysia from "elysia";
import { withUserId } from "../auth";
import { ChannelModel } from "./model";
import { ChannelService } from "./service";

export const ChannelController = new Elysia({ prefix: "/channel" })
	.use(bearer())
	.resolve(withUserId)
	.post("/send", ({ body }) => ChannelService.send(body), {
		body: ChannelModel.SendBody,
	})
	.get("/:guildId", ({ params, userId }) =>
		ChannelService.getAll({ guildId: params.guildId, userId }),
	);
