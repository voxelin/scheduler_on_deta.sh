import * as def from "../core/imports";

export default {
    command: "help",
    description: "Список команд.",
    in_list: false,
    run: async (ctx: def.Context) => {
        await ctx.reply("Якщо у вас виникли проблеми з роботою бота, повідомте @voxelin 🙂");
    },
};
