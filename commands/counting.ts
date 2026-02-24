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
	const arg = process.argv.find((a) => a.startsWith("--initial-count"));
	if (!arg) return 0;
	const value = arg.includes("=")
		? arg.split("=")[1]
		: process.argv[process.argv.indexOf(arg) + 1];
	const parsed = Number(value);
	return Number.isNaN(parsed) ? 0 : parsed;
}
