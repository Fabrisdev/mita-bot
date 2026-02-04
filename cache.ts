import type { api } from "./convex/_generated/api";

type Cache = {
	tickets: Ticket[];
};

const cache: Cache = {
	tickets: [],
};

export namespace Cache {
	export function store<K extends keyof Cache>(key: K, value: Cache[K]) {
		cache[key] = value;
	}
	export function read<K extends keyof Cache>(key: K) {
		return cache[key];
	}
}

type Ticket =
	(typeof api.functions.tickets.getTicketsFromGuild._returnType)[number];
