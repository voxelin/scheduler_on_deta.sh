import { format, getWeekOfMonth, isWeekend } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { bot } from "../bot";
import { schedule } from "../data/schedule";
import { CustomContext } from "../types/bot";
import { shelf_inline, show_keyboard_sch } from "../types/data_executors";
import { DevCheckQuery, SchedulerBot } from "./bot";
import { CommandHandlerError } from "./errors";
export class CommandHandler<C extends CustomContext = CustomContext> {
    constructor(private readonly sysHandlers: SystemHandler<C>) {}
    private localdate = utcToZonedTime(new Date(), "Europe/Kiev");
    public async start(ctx: C) {
        await ctx.reply("Працюю на благо учнів ліцею 🤖\nАвтор: @voxelin", { parse_mode: "Markdown" });
    }
    public async help(ctx: C) {
        await ctx.reply("Якщо у вас виникли проблеми з роботою бота, повідомте @voxelin 🙂");
    }
    public async about(ctx: C) {
        await ctx.reply(
            "Цей бот був створений для зручного доступу до розкладу занять та посилань на заняття.\n" +
                "Розробник: @voxelin",
        );
    }
    public async link(ctx: C) {
        if (isWeekend(this.localdate)) {
            return await ctx.reply("Сьогодні вихідний 🥳");
        }
        const _d = await this.sysHandlers.handleLink();
        const { urls, next } = _d;
        let { name } = _d;
        if (Object.keys(_d).length === 0) return ctx.reply("Уроки закінчились, відпочивайте! 🫂");
        const oddWeek = getWeekOfMonth(this.localdate) % 2;
        switch (name) {
            case "🎨 Мистецтво | 📜 Основи здоров'я":
                if (oddWeek == 0) {
                    name = "📜 Основи здоров'я";
                } else {
                    name = "🎨 Мистецтво";
                }
                break;
            case "🌍 Географія | 📜 Історія України":
                if (oddWeek == 0) {
                    name = "📜 Історія України";
                } else {
                    name = "🌍 Географія";
                }
                break;
            case "📚 Англійська":
                urls![0] = `1. <a href="${urls![0]}">Чепурна</a>\n2. <a href="${urls![1]}">Дунько</a>`;
                break;
            case "💻 Інформатика":
                urls![0] = `1. <a href="${urls![0]}">Беднар</a>\n2. <a href="${urls![1]}">Шеремет</a>`;
                break;
            default:
                break;
        }
        if (urls?.length != 0) {
            next == true
                ? await ctx.reply(`Посилання на наступний урок: <b>${name}</b> \n${urls![0]}`)
                : await ctx.reply(`Урок <b>${name}</b> вже почався: \n${urls![0]}`);
        } else {
            await ctx.reply("На жаль, на урок посилання немає. 🤔");
        }
    }

    public async schedule(ctx: C) {
        await show_keyboard_sch(ctx, ctx.from!.id, format(this.localdate, "EEEE"));
    }

    public async botinfo(ctx: C) {
        if (ctx.from?.id !== 5187696616) return ctx.reply("Тільки власник бота може використовувати цю команду 🤖");
        await ctx.reply(`
<code>@${(await bot.api.getMe()).username}</code> 🤖
├ <b>Uptime:</b> <code>${Math.round(process.uptime())}sec</code>
├ <b>Memory usage:</b> <code>${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB</code>
├ <b>Host:</b> <code>deta.sh</code>
├ <b>Endpoint:</b> <code>https://endpoint.blackvoxel.space</code>
├ <b>Node.js:</b> <code>${process.version}</code>
├ <b>Pending endpoint updates:</b> <code>${(await bot.api.getWebhookInfo()).pending_update_count - 1}</code>
└ <b>Commands:</b> <code>${Object.getOwnPropertyNames(Object.getPrototypeOf(this)).length}</code>`);
    }
    public async drop(ctx: C) {
        if (![1024118111, 1260609189, 953390376, 1220615061, 5187696616, 1888411613].includes(ctx.from!.id))
            return ctx.reply("Тільки уповноважений може використовувати цю команду 🤖");
        if (!DevCheckQuery) {
            if ((await bot.api.getWebhookInfo()).url !== "") {
                await ctx.reply("Видалення вебхука...");
                await bot.api.deleteWebhook({ drop_pending_updates: true });
                await ctx.reply("Вебхук видалено.");
            } else {
                await ctx.reply("Вебхук вже видалено. Пропуск...");
            }
            if (process.env.WEBHOOK_URL) {
                await ctx.reply("Встановлення вебхука...");
                await bot.api.setWebhook(process.env.WEBHOOK_URL);
                await ctx.reply("Вебхук встановлено. Очікування оновлень...");
            }
        } else {
            return ctx.reply("Ви в режимі тестування. Вебхук не встановлено.");
        }
    }

    public async shelf(ctx: C) {
        await ctx.reply("📚 Оберіть книгу:", {
            reply_markup: shelf_inline,
            disable_web_page_preview: true,
            reply_to_message_id: ctx.message?.message_id,
        });
    }
    public async cancel(ctx: C) {
        await ctx.reply("Дія скасована.", {
            reply_markup: {
                remove_keyboard: true,
            },
        });
    }
}

export class SystemHandler<C extends CustomContext> {
    public localdate = utcToZonedTime(new Date(), "Europe/Kiev");
    constructor(private readonly bot: SchedulerBot<C>, private readonly commands?: CommandHandler<C>) {
        this.commands = new CommandHandler<C>(this);
    }

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
            const [cmd, bot] = command.split("@");
            if (bot !== this.bot.botInfo.username) return;
            try {
                return await this.commands![cmd as keyof CommandHandler](ctx);
            } catch (e) {
                if (e instanceof TypeError) {
                    return;
                } else if (e instanceof CommandHandlerError) {
                    await ctx.reply("Помилка обробки команди. Повідомте @voxelin 🙂");
                } else {
                    console.error(e);
                }
            }
        } else {
            try {
                return await this.commands![command as keyof CommandHandler](ctx);
            } catch (e) {
                if (e instanceof TypeError) {
                    return;
                } else if (e instanceof CommandHandlerError) {
                    await ctx.reply("Помилка обробки команди. Повідомте @voxelin 🙂");
                } else {
                    console.error(e);
                }
            }
        }
    }
}
