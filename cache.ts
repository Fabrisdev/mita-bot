import type { api } from "./convex/_generated/api";

type Cache = {
	ticketsWithoutMessages: Ticket[];
};

const cache: Cache = {
	ticketsWithoutMessages: [],
};

export namespace Cache {
	export function store<K extends keyof Cache>(key: K, value: Cache[K]) {
		cache[key] = value;
	}
	export function read<K extends keyof Cache>(key: K) {
		return cache[key];
	}
	export function update<K extends keyof Cache>(
		key: K,
		updater: (current: Cache[K]) => Cache[K],
	) {
		const current = cache[key];
		cache[key] = updater(current);
	}
}

export type Ticket =
	(typeof api.functions.tickets.getTicketsWithoutMessagesFromGuild._returnType)[number];
