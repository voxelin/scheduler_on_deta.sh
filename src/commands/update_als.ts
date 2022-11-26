import { readdirSync } from "fs";
import { BotCommand } from "grammy/out/types.node";
import * as def from "../core/imports";
import Command from "./index.d";
export default {
    command: "update_als",
    description: "Оновити список команд.",
    aliases: [],
    in_list: false,
    run: async (ctx: def.Context) => {
        const commandlist: BotCommand[] = [];
        readdirSync("./dist/commands").forEach(async (file) => {
            if (file.endsWith(".js")) {
                const data: Command = (await import(`./${file}`)).default;
                if (data.in_list) {
                    commandlist.push({
                        command: data.command,
                        description: data.description,
                    });
                }
            }
        });
        await ctx.reply("Зачекайте, з'єднуюсь з API сервером...");
        await def.bot.api.setMyCommands(commandlist);
        await ctx.reply("Список команд успішно оновлено.");
    },
};
