import { t } from "elysia";

export namespace ChannelModel {
	export const SendBody = t.Object({
		channelId: t.String(),
		message: t.String(),
	});

	export type SendBody = typeof SendBody.static;

	export const GetAllParams = t.Object({
		guildId: t.String(),
	});
	export type GetAllParams = typeof GetAllParams.static;
}
