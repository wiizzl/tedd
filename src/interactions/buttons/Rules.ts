import { ButtonInteraction, ComponentType, EmbedBuilder, PermissionFlagsBits } from "discord.js";

import CustomClient from "../../base/classes/CustomClient";
import Interaction from "../../base/classes/Interaction";

export default class Rules extends Interaction {
    constructor(client: CustomClient) {
        super(client, {
            name: "rules",
            permissions: PermissionFlagsBits.UseApplicationCommands,
            type: ComponentType.Button,
        });
    }

    async Execute(interaction: ButtonInteraction) {
        return await interaction.reply({
            embeds: [new EmbedBuilder().setColor("Green").setDescription("✅ Merci d'avoir pris le temps de lire le règlement !")],
            ephemeral: true,
        });
    }
}
