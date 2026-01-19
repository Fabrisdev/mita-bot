import Elysia from "elysia";
import { apiPort } from "../environment";

const elysia = new Elysia()
	.get("/api/ok", "")
	.post("/api/send-message", ({ body }) => {});

export function startApiService() {
	const port = apiPort();
	elysia.listen(port);
	console.log("API service listening at:", port);
}
