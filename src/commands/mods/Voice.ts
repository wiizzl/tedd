import { ApplicationCommandOptionType, ChannelType, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, VoiceChannel } from "discord.js";

import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";

import Category from "../../base/enums/Category";
import Emojis from "../../base/enums/Emojis";

import GuildConfig from "../../base/schemas/GuildConfig";

export default class Voice extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "voice",
            description: "Définir le salon vocal permettant aux utilisateurs de créer le leur.",
            category: Category.Moderation,
            default_member_permissions: PermissionFlagsBits.Administrator,
            dm_permission: false,
            cooldown: 3,
            options: [
                {
                    name: "channel",
                    description: "Salon vocal de création.",
                    type: ApplicationCommandOptionType.Channel,
                    channel_types: [ChannelType.GuildVoice],
                    required: true,
                },
            ],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const channel = interaction.options.getChannel("channel") as VoiceChannel;

        await interaction.deferReply({ ephemeral: true });

        try {
            let guild = await GuildConfig.findOne({
                guildId: interaction.guildId,
            });

            if (!guild) {
                guild = await GuildConfig.create({
                    guildId: interaction.guildId,
                });
            }

            guild.voice.channelId = channel.id;

            await guild.save();

            return interaction.editReply({
                embeds: [new EmbedBuilder().setColor("Green").setDescription(`${Emojis.Tick} Le salon vocal a bien été défini.`)],
            });
        } catch (error) {
            console.error(error);

            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(
                            `${Emojis.Cross} Une erreur est survenue en mettant à jour la base de données. Merci de réessayer ultérieurement.`
                        ),
                ],
            });
        }
    }
}
