import { findArgWithValue } from "../args";

export namespace Counting {
	export const CHANNEL_ID = "1423258571990106163";
	const initialCount = getInitialNumber();
	console.log("Initial count set to:", initialCount);
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
