import { config } from "dotenv";
import { BotWrapper, DevCheckQuery } from "./core/bot";
import { CustomContext } from "./types/bot";
import { show_book, show_keyboard_sch } from "./types/data_executors";
if (DevCheckQuery) config({ path: ".env.dev" });
export const bot = new BotWrapper<CustomContext>(
    String(process.env.BOT_TOKEN),
    DevCheckQuery
        ? {
              botInfo: {
                  id: 5718541363,
                  is_bot: true,
                  first_name: "тестчунга",
                  username: "testchungabot",
                  can_join_groups: true,
                  can_read_all_group_messages: false,
                  supports_inline_queries: false,
              },
          }
        : {
              botInfo: {
                  id: 5558185718,
                  is_bot: true,
                  first_name: "Диктатор Зеленський",
                  username: "chungachanga_rebot",
                  can_join_groups: true,
                  can_read_all_group_messages: false,
                  supports_inline_queries: false,
              },
              client: {
                  canUseWebhookReply: (method) => method === "sendChatAction",
              },
          },
);
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
            await ctx.reply("Невідома книга!");
        }
    }
    try {
        await bot.sysHandlers.handleCommand(ctx, ctx.message.text!);
    } catch (e) {
        console.error(e);
    }
});

bot.on("callback_query", async (ctx) => {
    const day = ctx.callbackQuery.data ?? "Monday";
    await ctx.answerCallbackQuery();
    await show_keyboard_sch(ctx, day, false);
});

if (DevCheckQuery) {
    bot.logger.info("Bot is running in development mode!");
    bot.start();
}
