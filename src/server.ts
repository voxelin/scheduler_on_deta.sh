import { App } from "deta";
import express from "express";
import { webhookCallback } from "grammy";
import { bot } from "./bot";
const hook = App<express.Express>(express());
hook.use(express.json());

// This is the webhook callback route
hook.post("/" + process.env.BOT_TOKEN, webhookCallback(bot, "express"));

// Shortcut for setting up a webhook
hook.get("/setWebhookUrl", async (_req, res) => {
    await bot.api.setWebhook(process.env.WEBHOOK_URL ?? "https://endpoint.blackvoxel.space");
    res.send({ message: "Webhook url was set" });
});

// // cron job
// hook.lib.cron(async () => {
//     await bot.sysHandlers.handleAutomaticLink();
//     return "CRON";
// });

// default export
export = hook;
