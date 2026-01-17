import fs from "node:fs/promises";
import path from "node:path";
import type { Event } from "./types";

const EXPECTED_EXTENSION = ".event.ts";
const EXPECTED_FOLDERNAME = "events";

export async function fetchEvents() {
	const events = new Map<string, Event>();
	const files = await fs.readdir(EXPECTED_FOLDERNAME);
	for (const file of files) {
		if (!file.endsWith(EXPECTED_EXTENSION)) continue;
		const importedFile = await import(
			path.join("..", EXPECTED_FOLDERNAME, file)
		);
		const event = importedFile.default;
		const name = file.slice(0, -EXPECTED_EXTENSION.length);
		events.set(name, event);
	}
	return events;
}
