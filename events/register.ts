import { client } from "../client";
import { fetchEvents } from "./handler";

export async function registerEvents() {
	const events = await fetchEvents();
	for (const [name, fn] of events) {
		client.on(name, fn);
	}
}
