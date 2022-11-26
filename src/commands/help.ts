import { readdirSync } from "fs";
import Command from ".";
import * as def from "../core/imports";
export default {
    command: "help",
    description: "Список команд.",
    in_list: true,
    run: async (ctx: def.Context) => {
        let message = "🔮 Список доступних команд:\n";
        await Promise.all(
            readdirSync("./dist/commands").map(async (file) => {
                if (file.endsWith(".js")) {
                    const data: Command = (await import(`./${file}`)).default;
                    if (data.command !== undefined) {
                        message += `\`/${data.command}\` - *${data.description}*\n`;
                    }
                }
            }),
        );
        await ctx.reply(message, { parse_mode: "Markdown" });
    },
};
