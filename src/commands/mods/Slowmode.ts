import { ApplicationCommandOptionType, ChannelType, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, TextChannel } from "discord.js";

import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";

import Category from "../../base/enums/Category";
import GuildConfig from "../../base/schemas/GuildConfig";

export default class Slowmode extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "slowmode",
            description: "Définir le mode lent d'un salon.",
            category: Category.Moderation,
            default_member_permissions: PermissionFlagsBits.ManageChannels,
            dm_permission: false,
            cooldown: 5,
            options: [
                {
                    name: "rate",
                    description: "Taux de lenteur en secondes.",
                    type: ApplicationCommandOptionType.Integer,
                    required: true,
                    choices: [
                        { name: "Aucun", value: "0" },
                        { name: "5 secondes", value: "5" },
                        { name: "10 secondes", value: "10" },
                        { name: "15 secondes", value: "15" },
                        { name: "30 secondes", value: "30" },
                        { name: "1 minute", value: "60" },
                        { name: "2 minutes", value: "120" },
                        { name: "5 minutes", value: "300" },
                        { name: "10 minutes", value: "600" },
                        { name: "15 minutes", value: "900" },
                        { name: "30 minutes", value: "1800" },
                        { name: "1 heure", value: "3600" },
                        { name: "2 heure", value: "7200" },
                        { name: "6 heure", value: "21600" },
                    ],
                },
                {
                    name: "channel",
                    description: "Le salon dans lequel le mode lent sera appliqué (par défaut, le salon actuel).",
                    type: ApplicationCommandOptionType.Channel,
                    required: false,
                    channel_types: [ChannelType.GuildText],
                },
                {
                    name: "reason",
                    description: "Motif du mode lent.",
                    type: ApplicationCommandOptionType.String,
                    required: false,
                },
            ],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const rate = interaction.options.getInteger("rate")!;
        const channel = (interaction.options.getChannel("channel") || interaction.channel) as TextChannel;
        const reason = interaction.options.getString("reason") || "Aucun motif donné.";

        const errorEmbed = new EmbedBuilder().setColor("Red");

        if (rate < 0 || rate > 26000) {
            return await interaction.reply({
                embeds: [errorEmbed.setDescription("❌ Le taux de lenteur doit être compris entre 0 et 6 heures.")],
                ephemeral: true,
            });
        }

        try {
            channel.setRateLimitPerUser(rate, reason);
        } catch (error) {
            console.error(error);
            return await interaction.reply({
                embeds: [errorEmbed.setDescription("❌ Erreur lors de la modification du mode lent.")],
                ephemeral: true,
            });
        }

        const guild = await GuildConfig.findOne({ guildId: interaction.guildId });
        const log = guild?.logs?.moderation;

        if (guild && log?.enabled && log?.channelId) {
            ((await interaction.guild?.channels.fetch(log.channelId)) as TextChannel)?.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Blue")
                        .setAuthor({ name: "⌚ Mode lent" })
                        .setDescription(`Le mode lent du salon ${channel} a été modifié à \`${rate}\` secondes.`)
                        .setTimestamp()
                        .setFooter({
                            text: `Mode lent modifié par ${interaction.user.tag} - ${interaction.user.id}`,
                            iconURL: interaction.user.displayAvatarURL(),
                        }),
                ],
            });
        }

        return await interaction.reply({
            embeds: [
                new EmbedBuilder().setColor("Green").setDescription(`✅ Taux du mode lent modifié à \`${rate}\` secondes pour le salon ${channel}`),
            ],
            ephemeral: true,
        });
    }
}
