import { App } from "deta";
import express from "express";
import { webhookCallback } from "grammy";
import { bot } from "./bot";
const hook = App<express.Express>(express());
hook.use(express.json());

hook.post("/" + process.env.BOT_TOKEN, webhookCallback(bot, "express"));
hook.get("/setWebhookUrl", async (_req, res) => {
    await bot.api.setWebhook(process.env.WEBHOOK_URL ?? "https://endpoint.blackvoxel.space");
    res.send({ message: "Webhook url was set" });
});
hook.lib.cron(async (event: any) => {
    return await bot.sysHandlers.handleAutomaticLink();
});
export = hook;
