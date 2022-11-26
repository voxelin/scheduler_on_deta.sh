import * as def from "../core/imports";

export default {
    command: "botinfo",
    description: "Інформація про сервер бота.",
    in_list: false,
    prohibed: true,
    run: async (ctx: def.Context) => {
        if (ctx.from?.id !== 5187696616) return ctx.reply("Тільки власник бота може використовувати цю команду 🤖");
        await ctx.reply(`
<code>@${(await def.bot.api.getMe()).username}</code> 🤖
├ <b>Uptime:</b> <code>${Math.round(process.uptime())}sec</code>
├ <b>Memory usage:</b> <code>${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB</code>
├ <b>Host:</b> <code>deta.sh</code>
├ <b>Endpoint:</b> <code>https://endpoint.blackvoxel.space</code>
├ <b>Node.js:</b> <code>${process.version}</code>
├ <b>Pending endpoint updates:</b> <code>${(await def.bot.api.getWebhookInfo()).pending_update_count - 1}</code>
└ <b>Commands:</b> <code>${Object.getOwnPropertyNames(Object.getPrototypeOf(this)).length}</code>`);
    },
};
