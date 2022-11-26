import { autoRetry } from "@grammyjs/auto-retry";
import { parseMode } from "@grammyjs/parse-mode";
import { Bot } from "grammy";
import { CustomContext } from "../types/bot";
import { CommandHandler, SystemHandler } from "./handler";

export class SchedulerBot<C extends CustomContext> extends Bot<C> {
    public contextHandler: CommandHandler<C>;
    public sysHandlers: SystemHandler<C>;
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
        this.sysHandlers = new SystemHandler<C>(this);
        this.contextHandler = new CommandHandler<C>(this.sysHandlers);
    }

    public prepare() {
        this.api.config.use(parseMode("HTML"));
        this.api.config.use(autoRetry());
    }
}

export const DevCheckQuery = process.argv[2] === "--dev" || process.env.NODE_ENV === "development";
