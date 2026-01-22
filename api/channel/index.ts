import Elysia from "elysia";
import { GuildIdGuard } from "../helpers";
import { ChannelModel } from "./model";
import { ChannelService } from "./service";

export const ChannelController = new Elysia({ prefix: "/channel" })
	.guard(GuildIdGuard)
	.post(
		"/send",
		({ body, params }) =>
			ChannelService.send({
				channelId: body.channelId,
				guildId: params.guildId,
				message: body.message,
			}),
		{
			body: ChannelModel.SendBody,
		},
	)
	.get("/", ({ params }) => ChannelService.getAll({ guildId: params.guildId }));
