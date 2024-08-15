import { createTranscript } from "discord-html-transcripts";
import { ButtonInteraction, ChannelSelectMenuInteraction, ComponentType, EmbedBuilder, PermissionFlagsBits, TextChannel } from "discord.js";

import CustomClient from "../../../base/classes/CustomClient";
import Interaction from "../../../base/classes/Interaction";

import GuildConfig from "../../../base/schemas/GuildConfig";

import Emojis from "../../../base/enums/Emojis";

export default class Transcript extends Interaction {
    constructor(client: CustomClient) {
        super(client, {
            name: "transcript_ticket",
            permissions: PermissionFlagsBits.UseApplicationCommands,
            cooldown: 3,
            type: ComponentType.Button,
        });
    }

    async Execute(interaction: ButtonInteraction) {
        const transcript = await createTranscript(interaction.channel as TextChannel);

        try {
            interaction.user.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Yellow")
                        .setDescription(`📜 Voici le transcript de votre ticket du serveur \`${interaction.guild?.name}\`.`),
                ],
                files: [transcript],
            });
        } catch (error) {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(`${Emojis.Cross} Vos messages privés sont fermés, je n'ai donc pas pu vous envoyer le transcript.`),
                ],
                ephemeral: true,
            });
        }

        const guild = await GuildConfig.findOne({ guildId: interaction.guildId });
        const log = guild?.logs?.tickets;

        if (guild && log?.enabled && log?.channelId) {
            const channel = interaction.channel as TextChannel;

            ((await interaction.guild?.channels.fetch(log.channelId)) as TextChannel)?.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Purple")
                        .setThumbnail(interaction.user.displayAvatarURL({ size: 64 }))
                        .setAuthor({ name: "📜 Ticket | Transcript" })
                        .setDescription(
                            `Le transcript du ticket de \`${channel.name.split("-")[1]}\` - ${ChannelSelectMenuInteraction} a été demandé.`
                        )
                        .setFooter({
                            text: `Demande effectuée par ${interaction.user.tag} - ${interaction.user.id}`,
                            iconURL: interaction.user.displayAvatarURL(),
                        })
                        .setTimestamp(),
                ],
            });
        }

        return await interaction.reply({
            embeds: [new EmbedBuilder().setColor("Green").setDescription(`${Emojis.Tick} Transcript envoyé dans vos messages privés avec succès.`)],
            ephemeral: true,
        });
    }
}
