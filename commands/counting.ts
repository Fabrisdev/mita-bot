export namespace Counting {
	export const CHANNEL_ID = "1423258571990106163";

	const data = {
		currentNumber: 0,
		lastSenderId: "",
	};

	export async function get() {
		return data;
	}
}
