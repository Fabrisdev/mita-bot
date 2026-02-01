import { t } from "elysia";

export namespace TicketModel {
	export const GetAll = t.Object({
		guildId: t.String(),
	});
	export type GetAll = typeof GetAll.static;
}
