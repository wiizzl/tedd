import { ButtonInteraction, ComponentType, EmbedBuilder, PermissionFlagsBits } from "discord.js";

import CustomClient from "../../../base/classes/CustomClient";
import Interaction from "../../../base/classes/Interaction";

export default class Custom extends Interaction {
    constructor(client: CustomClient) {
        super(client, {
            name: "panel_custom",
            permissions: PermissionFlagsBits.UseApplicationCommands,
            cooldown: 3,
            type: ComponentType.Button,
        });
    }

    async Execute(interaction: ButtonInteraction) {
        return await interaction.reply({
            embeds: [new EmbedBuilder().setTitle("test")],
            ephemeral: true,
            components: [],
            files: [],
        });
    }
}
