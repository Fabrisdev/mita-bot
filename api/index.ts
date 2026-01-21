import { bearer } from "@elysiajs/bearer";
import Elysia, { status } from "elysia";
import { apiPort, apiSecret } from "../environment";
import { ChannelController } from "./channel";
import { StatusController } from "./status";

const elysia = new Elysia({ prefix: "/api" })
	.use(bearer())
	.onBeforeHandle(({ bearer }) => {
		if (!bearer || bearer !== apiSecret()) return status("Unauthorized");
	})
	.use(ChannelController)
	.use(StatusController);

export function startApiService() {
	const port = apiPort();
	elysia.listen(port);
	console.log("API service listening at:", port);
}
