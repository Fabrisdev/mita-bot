import { bearer } from "@elysiajs/bearer";
import { cors } from "@elysiajs/cors";
import Elysia from "elysia";
import { apiPort } from "../environment";
import { ChannelController } from "./channel";
import { GuildController } from "./guild";
import { StatusController } from "./status";

const elysia = new Elysia({ prefix: "/api" })
	.use(cors())
	.use(bearer())
	.use(StatusController)
	.use(GuildController)
	.use(ChannelController);

export function startApiService() {
	const port = apiPort();
	elysia.listen(port);
	console.log("API service listening at:", port);
}
