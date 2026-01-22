import { bearer } from "@elysiajs/bearer";
import Elysia, { status } from "elysia";
import { jwtVerify } from "jose";
import { apiPort, jwtSecret } from "../environment";
import { withUserId } from "./auth";
import { ChannelController } from "./channel";
import { StatusController } from "./status";

const elysia = new Elysia({ prefix: "/api" })
	.use(bearer())
	.use(StatusController)
	.onBeforeHandle(async ({ bearer }) => {
		if (!bearer) return status("Unauthorized");
		const verifyResult = await jwtVerify(bearer, jwtSecret()).catch(() => null);
		if (verifyResult === null) return status("Unauthorized");
	})
	.resolve(withUserId)
	.use(ChannelController);

export function startApiService() {
	const port = apiPort();
	elysia.listen(port);
	console.log("API service listening at:", port);
}
