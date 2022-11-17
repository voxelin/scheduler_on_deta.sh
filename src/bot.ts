import { DetaAdapter } from "@grammyjs/storage-deta";
import { config } from "dotenv";
import { session } from "grammy";
import { DevCheckQuery, SchedulerBot } from "./core/bot";
import { CustomContext, SessionData } from "./types/bot";

if (DevCheckQuery) config({ path: ".env.dev" });
export const bot = new SchedulerBot<CustomContext>();
bot.prepare();

bot.use(
    session({
        initial: () => ({ send_links: true }),
        storage: new DetaAdapter<SessionData>({
            baseName: "session",
            projectKey: process.env.DETA_PROJECT_KEY ?? "",
        }),
    }),
);

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
