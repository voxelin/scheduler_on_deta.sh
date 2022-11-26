import * as def from "../core/imports";

export default {
    command: "start",
    description: "Запустити бота.",
    aliases: [],
    in_list: false,
    run: async (ctx: def.Context) => {
        await ctx.reply("Працюю на благо учнів ліцею 🤖\nАвтор: @voxelin", { parse_mode: "Markdown" });
    },
};
