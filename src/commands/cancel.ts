import * as def from "../core/imports";

export default {
    command: "cancel",
    description: "Відмінити поточну дію.",
    in_list: false,
    run: async (ctx: def.Context) => {
        await ctx.reply("Дія скасована.", {
            reply_markup: {
                remove_keyboard: true,
            },
            reply_to_message_id: ctx.message?.message_id,
        });
    },
};
