import { ButtonInteraction, ComponentType, EmbedBuilder, PermissionFlagsBits } from "discord.js";

import CustomClient from "../../../base/classes/CustomClient";
import Interaction from "../../../base/classes/Interaction";

export default class Craft extends Interaction {
    constructor(client: CustomClient) {
        super(client, {
            name: "panel_craft",
            permissions: PermissionFlagsBits.UseApplicationCommands,
            cooldown: 3,
            type: ComponentType.Button,
        });
    }

    async Execute(interaction: ButtonInteraction) {
        return await interaction.reply({
            embeds: [new EmbedBuilder().setColor(interaction.message.embeds[0].color).setTitle("test")],
            ephemeral: true,
            components: [],
            files: [],
        });
    }
}
