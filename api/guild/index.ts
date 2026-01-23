import { bearer } from "@elysiajs/bearer";
import Elysia, { status } from "elysia";
import { jwtVerify } from "jose";
import { jwtSecret } from "../../environment";
import { GuildService } from "./service";

export const GuildController = new Elysia({ prefix: "/guild" })
	.use(bearer())
	.resolve(async ({ bearer }) => {
		if (!bearer) return status("Unauthorized");
		const verifyResult = await jwtVerify(bearer, jwtSecret()).catch(() => null);
		if (verifyResult === null) return status("Unauthorized");
		const { id } = verifyResult.payload as { id: string };
		return {
			userId: id,
		};
	})
	.get("/", GuildService.getAll);
