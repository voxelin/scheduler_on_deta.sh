require("dotenv/config");
import { bot } from "./bot";

bot.api.deleteWebhook();

bot.start();
