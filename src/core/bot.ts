import { autoRetry } from "@grammyjs/auto-retry";
import { parseMode } from "@grammyjs/parse-mode";
import { readdirSync } from "fs";
import { Bot, BotConfig } from "grammy";
import pino from "pino";
import Command from "../commands";
import { CustomContext } from "../types/bot";
import { SystemHandler } from "./handler";
export class BotWrapper<C extends CustomContext> extends Bot<C> {
    public sysHandlers: SystemHandler<C>;
    public commands: Command[] = [];
    public logger = pino();
    constructor(token: string, config?: BotConfig<C>) {
        super(token, config);
        this.sysHandlers = new SystemHandler<C>();
    }

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

export const DevCheckQuery = process.argv[2] === "--dev" || process.env.NODE_ENV === "development";
