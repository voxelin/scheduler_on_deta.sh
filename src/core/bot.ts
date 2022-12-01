import { autoRetry } from "@grammyjs/auto-retry";
import { parseMode } from "@grammyjs/parse-mode";
import { readdirSync } from "fs";
import { Bot } from "grammy";
import pino from "pino";
import Command from "../commands";
import { CustomContext } from "../types/bot";
import { SystemHandler } from "./handler";
export class SchedulerBot<C extends CustomContext> extends Bot<C> {
    public sysHandlers: SystemHandler<C>;
    public commands: Command[] = [];
    public logger = pino();
    constructor(
        token?: string,
        opts?: {
            botinfo: {
                id: number;
                is_bot: true;
                first_name: string;
                username: string;
                can_join_groups: boolean;
                can_read_all_group_messages: boolean;
                supports_inline_queries: boolean;
            };
            client?: {
                canUseWebhookReply?: (method: string) => boolean;
            };
        },
    ) {
        super(token || String(process.env.BOT_TOKEN), {
            client: {
                canUseWebhookReply: opts?.client?.canUseWebhookReply,
            },
            botInfo: opts?.botinfo,
        });
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
