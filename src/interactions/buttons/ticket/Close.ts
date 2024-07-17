import { ButtonInteraction, ComponentType, EmbedBuilder, PermissionFlagsBits, TextChannel } from "discord.js";

import { createTranscript } from "discord-html-transcripts";
import CustomClient from "../../../base/classes/CustomClient";
import Interaction from "../../../base/classes/Interaction";
import GuildConfig from "../../../base/schemas/GuildConfig";

export default class Close extends Interaction {
    constructor(client: CustomClient) {
        super(client, {
            name: "close_ticket",
            permissions: PermissionFlagsBits.UseApplicationCommands,
            type: ComponentType.Button,
        });
    }

    async Execute(interaction: ButtonInteraction) {
        const transcript = await createTranscript(interaction.channel as TextChannel);

        const guild = await GuildConfig.findOne({ guildId: interaction.guildId });
        const log = guild?.logs?.tickets;

        if (guild && log?.enabled && log?.channelId) {
            const channel = interaction.channel as TextChannel;

            ((await interaction.guild?.channels.fetch(log.channelId)) as TextChannel)?.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Purple")
                        .setThumbnail(interaction.user.displayAvatarURL({ size: 64 }))
                        .setAuthor({ name: "📜 Ticket | Fermeture" })
                        .setDescription(`Le ticket de \`${channel.name.split("-")[1]}\` a été fermé.`)
                        .setFooter({
                            text: `Fermeture effectuée par ${interaction.user.tag} - ${interaction.user.id}`,
                            iconURL: interaction.user.displayAvatarURL(),
                        })
                        .setTimestamp(),
                ],
                files: [transcript],
            });
        }

        return await interaction.channel?.delete();
    }
}
