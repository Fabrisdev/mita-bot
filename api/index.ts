import { bearer } from "@elysiajs/bearer";
import Elysia, { status } from "elysia";
import { jwtVerify } from "jose";
import { apiPort, jwtSecret } from "../environment";
import { ChannelController } from "./channel";
import { GuildController } from "./guild";
import { GuildIdGuard, isAdminAt } from "./helpers";
import { StatusController } from "./status";

const elysia = new Elysia({ prefix: "/api" })
	.use(bearer())
	.use(StatusController)
	.use(GuildController)
	.guard(GuildIdGuard)
	.onBeforeHandle(async ({ bearer, params }) => {
		if (!bearer) return status("Unauthorized");
		const verifyResult = await jwtVerify(bearer, jwtSecret()).catch(() => null);
		if (verifyResult === null) return status("Unauthorized");
		const { id } = verifyResult.payload as { id: string };
		if (!isAdminAt(params.guildId, id)) return status("Forbidden");
	})
	.use(ChannelController);

export function startApiService() {
	const port = apiPort();
	elysia.listen(port);
	console.log("API service listening at:", port);
}
