import { ButtonInteraction, Collection, EmbedBuilder, Events, PermissionsBitField, StringSelectMenuInteraction } from "discord.js";

import CustomClient from "../../../base/classes/CustomClient";
import Event from "../../../base/classes/Event";

import Emojis from "../../../base/enums/Emojis";

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
            if (interaction.customId.startsWith("giveaway_")) return;

            const file = this.client.interactions.find((i) => i.name === interaction.customId && i.type === interaction.componentType);

            if (!file) {
                this.client.interactions.delete(interaction.customId);

                return await interaction.reply({
                    embeds: [new EmbedBuilder().setColor("Red").setDescription(`${Emojis.Cross} Cette intéraction n'a pas d'action associée.`)],
                    ephemeral: true,
                });
            }

            const { cooldowns } = this.client;
            if (!cooldowns.has(interaction.customId)) {
                cooldowns.set(interaction.customId, new Collection());
            }

            const now = Date.now();
            const timestamps = cooldowns.get(interaction.customId)!;
            const cooldownAmount = file.cooldown * 1000;
            const cooldown = timestamps.get(interaction.user.id) || 0;

            const isAdmin =
                typeof interaction.member?.permissions === "string"
                    ? interaction.member?.permissions.includes("Administrator")
                    : interaction.member?.permissions.has("Administrator");

            if (timestamps.has(interaction.user.id) && cooldown && now < cooldown + cooldownAmount && !isAdmin) {
                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Red")
                            .setDescription(
                                `${Emojis.Cross} Merci d'attendre \`${((cooldown + cooldownAmount - now) / 1000).toFixed(
                                    0
                                )} secondes\` avant de ré-exécuter cette intéraction.`
                            ),
                    ],
                    ephemeral: true,
                });
            }

            timestamps.set(interaction.user.id, now);
            setTimeout(() => {
                timestamps.delete(interaction.user.id);
            }, cooldownAmount);

            if (
                file.permissions &&
                interaction.member?.permissions instanceof PermissionsBitField &&
                !interaction.member?.permissions.has(new PermissionsBitField(file.permissions))
            ) {
                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Red")
                            .setDescription(`${Emojis.Cross} Vous n'avez pas la permission d'utiliser cette intéraction.`),
                    ],
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
