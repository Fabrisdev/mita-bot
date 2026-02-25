import { client } from "./client";
import { isDevEnvironment } from "./consts";
import { token } from "./environment";
import { registerEvents } from "./events/register";

console.log(isDevEnvironment ? "Dev mode enabled." : "Working on production.");
await registerEvents();
client.login(token());
