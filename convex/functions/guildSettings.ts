import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const setAlertsChannel = mutation({
	args: {
		guildId: v.string(),
		channelId: v.string(),
	},
	handler: async (ctx, args) => {
		const alreadyExists = await ctx.db
			.query("guildSettings")
			.withIndex("by_guild", (q) => q.eq("guildId", args.guildId))
			.first();

		if (alreadyExists) {
			await ctx.db.patch(alreadyExists._id, {
				alertsChannelId: args.channelId,
			});
			return;
		}

		await ctx.db.insert("guildSettings", {
			guildId: args.guildId,
			alertsChannelId: args.channelId,
		});
	},
});

export const getByGuild = query({
	args: {
		guildId: v.string(),
	},
	handler: async (ctx, args) => {
		return await ctx.db
			.query("guildSettings")
			.withIndex("by_guild", (q) => q.eq("guildId", args.guildId))
			.first();
	},
});

export const setBirthdayChannel = mutation({
	args: {
		guildId: v.string(),
		channelId: v.string(),
	},
	handler: async (ctx, args) => {
		const settings = await ctx.db
			.query("guildSettings")
			.withIndex("by_guild", (q) => q.eq("guildId", args.guildId))
			.first();

		if (settings) {
			await ctx.db.patch(settings._id, {
				birthdayChannelId: args.channelId,
			});
			return settings._id;
		}

		return await ctx.db.insert("guildSettings", {
			guildId: args.guildId,
			birthdayChannelId: args.channelId,
		});
	},
});

export const setBirthdayRole = mutation({
	args: {
		guildId: v.string(),
		roleId: v.string(),
	},
	handler: async (ctx, args) => {
		const settings = await ctx.db
			.query("guildSettings")
			.withIndex("by_guild", (q) => q.eq("guildId", args.guildId))
			.first();

		if (settings) {
			await ctx.db.patch(settings._id, {
				birthdayRoleId: args.roleId,
			});
			return settings._id;
		}

		return await ctx.db.insert("guildSettings", {
			guildId: args.guildId,
			birthdayRoleId: args.roleId,
		});
	},
});

export const setCountingChannel = mutation({
	args: {
		guildId: v.string(),
		channelId: v.string(),
	},
	handler: async (ctx, args) => {
		const settings = await ctx.db
			.query("guildSettings")
			.withIndex("by_guild", (q) => q.eq("guildId", args.guildId))
			.first();

		if (settings) {
			await ctx.db.patch(settings._id, {
				countingChannelId: args.channelId,
			});
			return settings._id;
		}

		return await ctx.db.insert("guildSettings", {
			guildId: args.guildId,
			countingChannelId: args.channelId,
		});
	},
});
