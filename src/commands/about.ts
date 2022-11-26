import * as def from "../core/imports";

export default {
    command: "about",
    description: "Базова інформація про бота.",
    aliases: [],
    in_list: false,
    run: async (ctx: def.Context) => {
        await ctx.reply(
            "Цей бот був створений для зручного доступу до розкладу занять та посилань на заняття.\n" +
                "Розробник: @voxelin",
        );
    },
};
