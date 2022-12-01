import { format, getWeekOfMonth, isWeekend } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { bot } from "../bot";
import { schedule } from "../data/schedule";
import { CustomContext } from "../types/bot";
import { CommandHandlerError } from "./errors";

export class SystemHandler<C extends CustomContext> {
    public localdate = utcToZonedTime(new Date(), "Europe/Kiev");
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

    public async handleAutomaticLink() {
        const day = format(this.localdate, "EEEE");
        const time = format(this.localdate, "HH:mm");
        const week = getWeekOfMonth(this.localdate) % 2;
        if (!isWeekend(this.localdate)) {
            for (let i = 0; i < schedule[day].length; i++) {
                if (time >= schedule[day][i].start && time <= schedule[day][i].end) {
                    if (schedule[day][i].sent) return;
                    schedule[day][i].sent = true;
                    if (schedule[day][i].urls.length == 1) {
                        return await bot.api.sendMessage(
                            Number(process.env.GID),
                            `Урок <code>${schedule[day][i].name}</code> починається!\n${schedule[day][i].urls[0]}`,
                            {
                                parse_mode: "HTML",
                            },
                        );
                    } else {
                        switch (schedule[day][i].name) {
                            case "📚 Англійська":
                                await bot.api.sendMessage(
                                    Number(process.env.GID),
                                    `<b>Починається урок</b> <code>${name}</code> \n1. <a href="${schedule[day][i].urls[0]}">Чепурна</a>\n2. <a href="${schedule[day][i].urls[1]}">Дунько</a>`,
                                    { disable_web_page_preview: true, parse_mode: "HTML" },
                                );
                                break;
                            case "💻 Інформатика":
                                await bot.api.sendMessage(
                                    Number(process.env.GID),
                                    `<b>Починається урок</b> <code>${name}</code> \n1. <a href="${schedule[day][i].urls[0]}">Беднар</a>\n2. <a href="${schedule[day][i].urls[1]}">Шеремет</a>`,
                                    { disable_web_page_preview: true, parse_mode: "HTML" },
                                );
                                break;
                            case "🎨 Мистецтво | 📜 Основи здоров'я":
                                if (week == 0) {
                                    await bot.api.sendMessage(
                                        Number(process.env.GID),
                                        `<b>Починається урок</b> <code>📜 Основи здоров'я</code> \n${schedule[day][i].urls[1]}`,
                                        {
                                            disable_web_page_preview: true,
                                            parse_mode: "HTML",
                                        },
                                    );
                                } else {
                                    await bot.api.sendMessage(
                                        Number(process.env.GID),
                                        `<b>Починається урок</b> <code>🎨 Мистецтво</code> \n${schedule[day][i].urls[0]}`,
                                        {
                                            disable_web_page_preview: true,
                                            parse_mode: "HTML",
                                        },
                                    );
                                }
                                break;
                            case "🌍 Географія | 📜 Історія України":
                                if (week == 0) {
                                    await bot.api.sendMessage(
                                        Number(process.env.GID),
                                        `<b>Починається урок</b> <code>📜 Історія України</code> \n${schedule[day][i].urls[1]}`,
                                        {
                                            disable_web_page_preview: true,
                                            parse_mode: "HTML",
                                        },
                                    );
                                } else {
                                    await bot.api.sendMessage(
                                        Number(process.env.GID),
                                        `<b>Починається урок</b> <code>🌍 Географія</code> \n${schedule[day][i].urls[0]}`,
                                        {
                                            disable_web_page_preview: true,
                                            parse_mode: "HTML",
                                        },
                                    );
                                }
                                break;
                        }
                    }
                }
            }
        } else {
            return;
        }
    }
}
