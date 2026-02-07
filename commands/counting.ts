import { CountingDB } from "../db";

type CountingData = {
	channelId: string;
	currentNumber: number;
	lastSenderId: string;
} | null;

const CountingCache = new Map<string, CountingData>();

export namespace Counting {
	export async function get(guildId: string) {
		const data = CountingCache.get(guildId);
		if (data) return data;
		const channelId = await CountingDB.getChannel(guildId);
		if (channelId === undefined) {
			CountingCache.set(guildId, null);
			return null;
		}
		const defaultData = {
			channelId,
			currentNumber: 0,
			lastSenderId: "",
		};
		CountingCache.set(guildId, defaultData);
		return defaultData;
	}
}
