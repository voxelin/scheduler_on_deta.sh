import { format, isWeekend } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { bot } from "../bot";
import { schedule } from "../data/schedule";
import { CustomContext } from "../types/bot";
import { SchedulerBot } from "./bot";
import { CommandHandlerError } from "./errors";

export class SystemHandler<C extends CustomContext> {
    public localdate = utcToZonedTime(new Date(), "Europe/Kiev");
    constructor(private readonly bot: SchedulerBot<C>) {}

    public async handleLink() {
        const day = format(this.localdate, "EEEE");
        const time = format(this.localdate, "HH:mm");
        let _next = false;
        let _name = "";
        let _urls: string[] = [];
        let _sent = false;
        if (!isWeekend(this.localdate)) {
            for (let i = 0; i < schedule[day].length; i++) {
                if (time >= schedule[day][schedule[day].length - 1].end) {
                    return {};
                }
                if (time >= schedule[day][i].start && time <= schedule[day][i].end) {
                    _sent = schedule[day][i].sent ?? false;
                    _urls = schedule[day][i].urls;
                    _name = schedule[day][i].name;
                    schedule[day][i].sent = true;
                    break;
                }
                if (time >= schedule[day][i].end && time <= schedule[day][i + 1].start) {
                    _sent = schedule[day][i + 1].sent ?? false;
                    _urls = schedule[day][i + 1].urls;
                    _name = schedule[day][i + 1].name;
                    _next = true;
                    schedule[day][i + 1].sent = true;
                    break;
                }
            }
        } else {
            return {};
        }
        return { urls: _urls, name: _name, next: _next, sent: _sent };
    }

    public async handleCommand(ctx: C, command?: string) {
        if (!command) throw new CommandHandlerError("Command is undefined");
        if (command.startsWith("/")) command = command.slice(1);
        if (command.includes("@")) {
            if (command.split("@")[1] !== bot.botInfo.username) return;
            command = command.split("@")[0];
        }
        if (bot.commands.filter((cmd) => cmd.command === command).length > 0) {
            return bot.commands.filter((cmd) => cmd.command === command)[0].run(ctx);
        }
    }
}
