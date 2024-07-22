import { ButtonInteraction, ComponentType, StringSelectMenuInteraction } from "discord.js";

import CustomClient from "../classes/CustomClient";

export default interface IInteraction {
    client: CustomClient;
    name: string;
    permissions: bigint;
    cooldown: number;
    type: ComponentType;

    Execute(interaction: ButtonInteraction | StringSelectMenuInteraction): void;
}
