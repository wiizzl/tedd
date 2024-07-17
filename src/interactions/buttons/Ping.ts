import { ButtonInteraction, ColorResolvable, ComponentType, PermissionFlagsBits } from "discord.js";

import CustomClient from "../../base/classes/CustomClient";
import Interaction from "../../base/classes/Interaction";

export default class Ping extends Interaction {
    constructor(client: CustomClient) {
        super(client, {
            name: "ping",
            permissions: PermissionFlagsBits.UseApplicationCommands,
            type: ComponentType.Button,
        });
    }

    async Execute(interaction: ButtonInteraction) {
        await interaction.deferUpdate();

        const ping = this.client.ws.ping;

        let color: ColorResolvable;
        if (ping < 50) {
            color = "Green";
        } else if (ping < 100) {
            color = "Orange";
        } else {
            color = "Red";
        }

        return await interaction.editReply({
            embeds: [interaction.message.embeds[0]],
        });
    }
}
