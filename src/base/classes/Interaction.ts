import { ButtonInteraction, ComponentType, StringSelectMenuInteraction } from "discord.js";

import CustomClient from "./CustomClient";

import IInteraction from "../interfaces/IInteraction";
import IInteractionOptions from "../interfaces/IInteractionOptions";

export default class Interaction implements IInteraction {
    client: CustomClient;
    name: string;
    permissions: bigint;
    type: ComponentType;

    constructor(client: CustomClient, options: IInteractionOptions) {
        this.client = client;
        this.name = options.name;
        this.permissions = options.permissions;
        this.type = options.type;
    }

    Execute(interaction: ButtonInteraction | StringSelectMenuInteraction): void {}
}
