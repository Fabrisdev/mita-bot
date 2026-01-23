import { t } from "elysia";

export namespace GuildModel {
	export const GetAll = t.Object({
		userId: t.String(),
	});
	export type GetAll = typeof GetAll.static;
}
