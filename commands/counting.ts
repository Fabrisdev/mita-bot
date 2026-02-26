import { findArgWithValue } from "../args";
import { Log } from "../log";

export namespace Counting {
	const initialCount = getInitialNumber();
	Log.log("Initial count set to:", initialCount);
	const data = {
		currentNumber: getInitialNumber(),
		lastSenderId: "",
	};

	export function get() {
		return data;
	}
}

function getInitialNumber() {
	const value = findArgWithValue("initial-count");
	const parsed = Number(value);
	return Number.isNaN(parsed) ? 0 : parsed;
}
