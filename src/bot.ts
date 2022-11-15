import { DetaAdapter } from "@grammyjs/storage-deta";
import { session } from "grammy";
import { SchedulerBot } from "./core/bot";
import { CustomContext, SessionData } from "./types/bot";

export const bot = new SchedulerBot<CustomContext>(process.env.BOT_TOKEN || "");

bot.use(
    session({
        initial: () => ({ send_links: true }),
        storage: new DetaAdapter<SessionData>({
            baseName: "session",
            projectKey: process.env.DETA_PROJECT_KEY || "",
        }),
    }),
);

bot.on("message", async (ctx) => {
    try {
        await bot.sysHandlers.handleCommand(ctx, ctx.message.text);
    } catch (e) {
        return;
    }
});
