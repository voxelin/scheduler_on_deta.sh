import { autoRetry } from "@grammyjs/auto-retry";
import { parseMode } from "@grammyjs/parse-mode";
import { Bot, Context } from "grammy";
import { CustomContext } from "../types/bot";
import { schedule_days_menu } from "../types/menu";
import { CommandHandler, SystemHandler } from "./handler";

export class SchedulerBot<C extends CustomContext> extends Bot<C> {
    public contextHandler: CommandHandler<C>;
    public sysHandlers: SystemHandler<C>;
    constructor(token: string) {
        super(token || String(process.env.BOT_TOKEN));
        this.sysHandlers = new SystemHandler<C>(this);
        this.contextHandler = new CommandHandler<C>(this.sysHandlers);
    }

    public prepare() {
        this.api.config.use(parseMode("HTML"));
        this.use(schedule_days_menu);
        this.api.config.use(autoRetry());
    }
}
