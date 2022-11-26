import * as def from "../core/imports";

export default {
    name: "cancel",
    description: "Відмінити поточну дію.",
    in_list: false,
    run: async (ctx: def.Context) => {
        await ctx.reply("Дія скасована.", {
            reply_markup: {
                remove_keyboard: true,
            },
        });
    },
};