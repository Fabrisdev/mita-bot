const cache: Record<string, unknown> = {};

export namespace Cache {
	export function store(key: string, value: unknown) {
		cache[key] = value;
	}
	export function read(key: string) {
		return cache[key];
	}
}
