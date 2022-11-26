import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import * as def from "../core/imports";
import { show_keyboard_sch } from "../types/data_executors";

export default {
    command: "schedule",
    description: "Дізнатись розклад уроків та посилання на них.",
    in_list: true,
    run: async (ctx: def.Context) => {
        const date = utcToZonedTime(new Date(), "Europe/Kiev");
        await show_keyboard_sch(ctx, ctx.from!.id, format(date, "EEEE"));
    },
};
