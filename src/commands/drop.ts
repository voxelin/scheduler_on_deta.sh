import * as def from "../core/imports";

export default {
    name: "drop",
    description: "[УПОВНОВАЖЕНІ] Перепризначити вебхук.",
    aliases: [],
    in_list: false,
    run: async (ctx: def.Context) => {
        if (![1024118111, 1260609189, 953390376, 1220615061, 5187696616, 1888411613].includes(ctx.from!.id))
            return ctx.reply("Тільки уповноважений може використовувати цю команду 🤖");
        if (!def.DevCheckQuery) {
            if ((await def.bot.api.getWebhookInfo()).url !== "") {
                await ctx.reply("Видалення вебхука...");
                await def.bot.api.deleteWebhook({ drop_pending_updates: true });
                await ctx.reply("Вебхук видалено.");
            } else {
                await ctx.reply("Вебхук вже видалено. Пропуск...");
            }
            if (process.env.WEBHOOK_URL) {
                await ctx.reply("Встановлення вебхука...");
                await def.bot.api.setWebhook(process.env.WEBHOOK_URL);
                await ctx.reply("Вебхук встановлено. Очікування оновлень...");
            }
        } else {
            return ctx.reply("Ви в режимі тестування. Вебхук не встановлено.");
        }
    },
};
