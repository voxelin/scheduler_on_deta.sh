import * as def from "../core/imports";
import { shelf_inline } from "../types/data_executors";

export default {
    command: "shelf",
    description: "Завантажити книгу з приватної галереї.",
    in_list: true,
    run: async (ctx: def.Context) => {
        await ctx.reply("📚 Оберіть книгу:", {
            reply_markup: shelf_inline,
            disable_web_page_preview: true,
            reply_to_message_id: ctx.message?.message_id,
        });
    },
};
