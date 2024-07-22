import { ComponentType, EmbedBuilder, GuildChannel, PermissionFlagsBits, StringSelectMenuInteraction } from "discord.js";

import CustomClient from "../../base/classes/CustomClient";
import Interaction from "../../base/classes/Interaction";

export default class Voice extends Interaction {
    constructor(client: CustomClient) {
        super(client, {
            name: "voice",
            permissions: PermissionFlagsBits.UseApplicationCommands,
            cooldown: 3,
            type: ComponentType.StringSelect,
        });
    }

    async Execute(interaction: StringSelectMenuInteraction) {
        await interaction.message.edit({
            embeds: [interaction.message.embeds[0]],
        });

        if (interaction.message.content.split("@")[1].split(">")[0] !== interaction.user.id) {
            return await interaction.reply({
                embeds: [new EmbedBuilder().setColor("Red").setDescription("❌ Vous n'êtes pas le propriétaire du salon.")],
                ephemeral: true,
            });
        }

        const interactionChannel = interaction.channel as GuildChannel;

        try {
            switch (interaction.values[0]) {
                case "open":
                    await interactionChannel.permissionOverwrites.create(interaction.guild?.id!, {
                        ViewChannel: true,
                        Connect: true,
                    });
                    break;

                case "closed":
                    await interactionChannel.permissionOverwrites.create(interaction.guild?.id!, {
                        ViewChannel: true,
                        Connect: false,
                    });
                    break;

                case "locked":
                    await interactionChannel.permissionOverwrites.create(interaction.guild?.id!, {
                        ViewChannel: false,
                        Connect: true,
                    });
                    break;

                default:
                    throw new Error("Invalid string menu value");
            }

            return await interaction.reply({
                embeds: [new EmbedBuilder().setColor("Green").setDescription("✅ Action effectuée avec succès.")],
                ephemeral: true,
            });
        } catch (error) {
            console.error(error);
            return await interaction.reply({
                embeds: [new EmbedBuilder().setColor("Red").setDescription("❌ Une erreur est survenue lors de la création du ticket.")],
                ephemeral: true,
            });
        }
    }
}
