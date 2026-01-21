import Elysia from "elysia";

export const StatusController = new Elysia({ prefix: "status" }).get("/ok", "");
