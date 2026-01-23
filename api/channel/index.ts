import { bearer } from "@elysiajs/bearer";
import Elysia, { status } from "elysia";
import { jwtVerify } from "jose";
import { jwtSecret } from "../../environment";
import { isAdminAt } from "../helpers";
import { ChannelModel } from "./model";
import { ChannelService } from "./service";

export const ChannelController = new Elysia({ prefix: "/:guildId/channel" })
	.use(bearer())
	.onBeforeHandle(async ({ bearer, params }) => {
		if (!bearer) return status("Unauthorized");
		const verifyResult = await jwtVerify(bearer, jwtSecret()).catch(() => null);
		if (verifyResult === null) return status("Unauthorized");
		const { id } = verifyResult.payload as { id: string };
		if (!isAdminAt(params.guildId, id)) return status("Forbidden");
	})
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
