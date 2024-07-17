import { ComponentType } from "discord.js";

export default interface IInteractionOptions {
    name: string;
    permissions: bigint;
    type: ComponentType;
}
