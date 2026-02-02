import { bearer } from "@elysiajs/bearer";
import Elysia, { status } from "elysia";
import { jwtVerify } from "jose";
import { jwtSecret } from "../../environment";
import { isAdminAt } from "../helpers";
import { TicketService } from "./service";

export const TicketController = new Elysia({ prefix: "/:guildId/ticket" })
	.use(bearer())
	.onBeforeHandle(async ({ bearer, params }) => {
		if (!bearer) return status("Unauthorized");
		const verifyResult = await jwtVerify(bearer, jwtSecret()).catch(() => null);
		if (verifyResult === null) return status("Unauthorized");
		const { id } = verifyResult.payload as { id: string };
		if (!isAdminAt(params.guildId, id)) return status("Forbidden");
	})
	.get("/", ({ params }) => TicketService.getAll({ guildId: params.guildId }));
