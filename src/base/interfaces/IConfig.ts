import { ColorResolvable } from "discord.js";

export default interface IConfig {
    token: string;
    id: string;
    guild: string;
    color: ColorResolvable;
    mongoUrl: string;
}
