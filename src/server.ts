import express from "express";
import { webhookCallback } from "grammy";
import { bot } from "./bot";

const hook = express();
hook.use(express.json());

hook.post("/" + process.env.BOT_TOKEN, webhookCallback(bot, "express"));

export = hook;
