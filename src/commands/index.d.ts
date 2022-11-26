export default interface Command {
    command: string;
    description: string;
    aliases: string[];
    in_list: boolean = true;
    run: (ctx: Context) => Promise<void>;
}
