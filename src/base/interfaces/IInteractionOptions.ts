import { ComponentType } from "discord.js";

export default interface IInteractionOptions {
    name: string;
    permissions: bigint;
    cooldown: number;
    type: ComponentType;
}
