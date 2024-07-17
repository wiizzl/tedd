import { ButtonInteraction, EmbedBuilder, Events, PermissionsBitField, StringSelectMenuInteraction } from "discord.js";

import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";

export default class InteractionHandler extends Event {
    constructor(client: CustomClient) {
        super(client, {
            name: Events.InteractionCreate,
            description: "Interaction handler event",
            once: false,
        });
    }

    async Execute(interaction: ButtonInteraction | StringSelectMenuInteraction) {
        if (interaction.isButton() || interaction.isStringSelectMenu()) {
            const file = this.client.interactions.find((i) => i.name === interaction.customId && i.type === interaction.componentType);

            if (!file) {
                this.client.interactions.delete(interaction.customId);

                return await interaction.reply({
                    embeds: [new EmbedBuilder().setColor("Red").setDescription("❌ Cette intéraction n'a pas d'action associée.")],
                    ephemeral: true,
                });
            }

            if (
                file.permissions &&
                interaction.member?.permissions instanceof PermissionsBitField &&
                !interaction.member?.permissions.has(new PermissionsBitField(file.permissions))
            ) {
                return await interaction.reply({
                    embeds: [new EmbedBuilder().setColor("Red").setDescription("❌ Vous n'avez pas la permission d'utiliser cette intéraction.")],
                    ephemeral: true,
                });
            }

            try {
                return file.Execute(interaction);
            } catch (error) {
                console.error(error);
            }
        }
    }
}
