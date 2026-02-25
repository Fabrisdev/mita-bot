import { findBooleanArg } from "./args";

const DEV_ARG_NAME = "dev";

export const isDevEnvironment = findBooleanArg(DEV_ARG_NAME);

export const BIRTHDAY_ROLE_ID = isDevEnvironment
	? "1476021499868483855"
	: "1424184101354602506";
export const BIRTHDAY_CHANNEL_ID = isDevEnvironment
	? "1461519622615597245"
	: "1369436131984277564"; //general-eng
export const REDDIT_POSTS_CHANNEL_ID = isDevEnvironment
	? "1474975172565143713"
	: "1475223863297314816";
