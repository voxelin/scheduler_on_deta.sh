import { autoRetry } from "@grammyjs/auto-retry";
import { parseMode } from "@grammyjs/parse-mode";
import { readdirSync } from "fs";
import { Bot, BotConfig } from "grammy";
import pino from "pino";
import Command from "../commands";
import { CustomContext } from "../types/bot";
import { SystemHandler } from "./handler";

/**
 * BotWrapper is a wrapper class for the [GrammY](https://github.com/grammy-js/grammy) bot library. It provides convenient methods for adding commands, handlers, and other functionality to your bot.
 *
 * @example
 * const bot = new BotWrapper('<token>');
 * bot.prepare();
 *
 * @param token The token of your Telegram Bot.
 * @param config Optional configuration object for the bot.
 */
export class BotWrapper<C extends CustomContext> extends Bot<C> {
    public sysHandlers: SystemHandler<C>;
    public commands: Command[] = [];
    public logger = pino();
    constructor(token: string, config?: BotConfig<C>) {
        super(token, config);
        this.sysHandlers = new SystemHandler<C>();
    }

    /**
     * prepare is a method of the BotWrapper which is responsible for setting up the bot. It sets up the API middlewares and loads the commands from the `./dist/commands` directory.
     */
    public prepare() {
        this.api.config.use(parseMode("HTML"));
        this.api.config.use(autoRetry());
        readdirSync("./dist/commands").forEach(async (file) => {
            if (file.endsWith(".js")) {
                const data: Command = (await import(`../commands/${file}`)).default;
                this.commands.push(data);
            }
        });
    }
}

/**
 * DevCheckQuery is a boolean value that checks if the bot is running in development mode. It is set to `true` if the `--dev` flag is passed as an argument or if the `NODE_ENV` environment variable is set to `development`.
 */
export const DevCheckQuery = process.argv[2] === "--dev" || process.env.NODE_ENV === "development";
