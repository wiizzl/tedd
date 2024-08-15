import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    ComponentType,
    EmbedBuilder,
    GuildChannel,
    PermissionFlagsBits,
    StringSelectMenuInteraction,
} from "discord.js";

import CustomClient from "../../base/classes/CustomClient";
import Interaction from "../../base/classes/Interaction";

import Emojis from "../../base/enums/Emojis";

export default class Ticket extends Interaction {
    constructor(client: CustomClient) {
        super(client, {
            name: "ticket",
            permissions: PermissionFlagsBits.UseApplicationCommands,
            cooldown: 3,
            type: ComponentType.StringSelect,
        });
    }

    async Execute(interaction: StringSelectMenuInteraction) {
        const interactionChannel = interaction.channel as GuildChannel;

        await interaction.message.edit({
            embeds: [interaction.message.embeds[0]],
        });

        try {
            const channel = await interaction.guild?.channels.create({
                name: `ticket-${interaction.user.username}`,
                type: ChannelType.GuildText,
                parent: interactionChannel.parent,
            });

            await channel?.permissionOverwrites.create(interaction.guild?.id!, { ViewChannel: false });
            await channel?.permissionOverwrites.create(interaction.user.id, {
                ViewChannel: true,
                SendMessages: true,
                ReadMessageHistory: true,
                AttachFiles: true,
                EmbedLinks: true,
            });
            await channel?.permissionOverwrites.create(interaction.client.user.id, {
                ViewChannel: true,
                SendMessages: true,
                ReadMessageHistory: true,
                AttachFiles: true,
                EmbedLinks: true,
            });

            await channel?.setTopic(interaction.user.id);

            await channel?.send({
                content: interaction.user.toString(),
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`${interaction.user.displayName} vient de créer un ticket.`)
                        .setDescription(`Catégorie : \`${interaction.values[0]}\`\n\n**Merci de décrire votre demande dans ce salon.**`)
                        .setTimestamp(),
                ],
                components: [
                    new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder().setLabel("Fermer le ticket").setEmoji("🗑️").setStyle(ButtonStyle.Danger).setCustomId("close_ticket"),
                        new ButtonBuilder()
                            .setLabel("Récupérer le transcript")
                            .setEmoji("📜")
                            .setStyle(ButtonStyle.Primary)
                            .setCustomId("transcript_ticket")
                    ),
                ],
            });

            return await interaction.reply({
                embeds: [new EmbedBuilder().setColor("Green").setDescription(`${Emojis.Tick} Votre ticket a été créé avec succès : ${channel}`)],
                ephemeral: true,
            });
        } catch (error) {
            console.error(error);
            return await interaction.reply({
                embeds: [new EmbedBuilder().setColor("Red").setDescription(`${Emojis.Cross} Une erreur est survenue lors de la création du ticket.`)],
                ephemeral: true,
            });
        }
    }
}
