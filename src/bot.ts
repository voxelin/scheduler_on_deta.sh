import { config } from "dotenv";
import { DevCheckQuery, SchedulerBot } from "./core/bot";
import { CustomContext } from "./types/bot";
import { show_book, show_keyboard_sch } from "./types/data_executors";
if (DevCheckQuery) config({ path: ".env.dev" });
export const bot = new SchedulerBot<CustomContext>();
bot.prepare();

bot.on(":file", async (ctx) => {
    if (DevCheckQuery) {
        await ctx.reply(`📁 *${ctx.message!.document!.file_name}* - \`${ctx.message!.document!.file_id}\`\n`, {
            parse_mode: "Markdown",
        });
    }
});

bot.on("message", async (ctx) => {
    if (ctx.message?.text?.startsWith("📕 ")) {
        try {
            const book = ctx.message.text.slice(3);
            const bookdata = show_book(book);
            await ctx.reply(`📕 <b><a href="${bookdata.url}">${book}</a></b>:`, {
                disable_web_page_preview: true,
                reply_markup: { remove_keyboard: true },
            });
            await ctx.replyWithDocument(bookdata.file_id);
        } catch (e) {
            console.log(e);
            await ctx.reply("Невідома книга!");
        }
    }
    try {
        await bot.sysHandlers.handleCommand(ctx, ctx.message.text!);
    } catch (e) {
        return;
    }
});

bot.on("callback_query", async (ctx) => {
    const [day, from_id] = ctx.callbackQuery!.data!.split(":");
    if (Number(from_id) !== ctx.callbackQuery.from.id)
        return await ctx.answerCallbackQuery("🤖 Ви не можете використовувати цю кнопку!");
    await ctx.answerCallbackQuery();
    await show_keyboard_sch(ctx, ctx.from!.id, day, false);
});

if (!process.env.WEBHOOK_URL) {
    bot.api.deleteWebhook();
    bot.start();
} else {
    bot.api.setWebhook(process.env.WEBHOOK_URL ?? "https://example.com");
}
