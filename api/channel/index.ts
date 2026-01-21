import Elysia from "elysia";
import { ChannelModel } from "./model";
import { ChannelService } from "./service";

export const ChannelController = new Elysia({ prefix: "/channel" }).post(
	"/send",
	({ body }) => ChannelService.send(body),
	{ body: ChannelModel.SendBody },
);
