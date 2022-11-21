import { config } from "dotenv";
import { DevCheckQuery, SchedulerBot } from "./core/bot";
import { CustomContext } from "./types/bot";
if (DevCheckQuery) config({ path: ".env.dev" });
export const bot = new SchedulerBot<CustomContext>();
bot.prepare();

bot.on("message", async (ctx) => {
    try {
        await bot.sysHandlers.handleCommand(ctx, ctx.message.text!);
    } catch (e) {
        return;
    }
});

if (DevCheckQuery) {
    bot.api.deleteWebhook();
    bot.start();
} else {
    bot.api.setWebhook(process.env.WEBHOOK_URL!);
}
