import { client } from "../client";
import { fetchEvents } from "./eventsHandler";

export async function registerEvents() {
	const events = await fetchEvents();
	for (const [name, fn] of events) {
		client.on(name, fn);
	}
}
