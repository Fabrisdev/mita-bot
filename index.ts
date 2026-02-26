import { client } from "./client";
import { isDevEnvironment } from "./consts";
import { token } from "./environment";
import { registerEvents } from "./events/register";
import { Log } from "./log";

Log.log(isDevEnvironment ? "DEV mode enabled." : "Working on production.");
await registerEvents();
client.login(token());
