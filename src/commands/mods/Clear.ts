import {
    ApplicationCommandOptionType,
    ChannelType,
    ChatInputCommandInteraction,
    Collection,
    EmbedBuilder,
    GuildMember,
    Message,
    PermissionFlagsBits,
    TextChannel,
} from "discord.js";

import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";

import Category from "../../base/enums/Category";
import Emojis from "../../base/enums/Emojis";

import GuildConfig from "../../base/schemas/GuildConfig";

export default class Clear extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "clear",
            description: "Supprime des messages d'un utilisateur ou d'un salon.",
            category: Category.Moderation,
            cooldown: 5,
            dm_permission: false,
            default_member_permissions: PermissionFlagsBits.ManageMessages,
            options: [
                {
                    name: "amount",
                    description: "Le nombre de messages à supprimer.",
                    type: ApplicationCommandOptionType.Integer,
                    required: true,
                },
                {
                    name: "channel",
                    description: "Le salon où les messages seront supprimés (par défaut, le salon actuel).",
                    type: ApplicationCommandOptionType.Channel,
                    required: false,
                    channel_types: [ChannelType.GuildText],
                },
                {
                    name: "target",
                    description: "L'utilisateur dont les messages seront supprimés (par défaut, tous les utilisateurs).",
                    type: ApplicationCommandOptionType.User,
                    required: false,
                },
            ],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        let amount = interaction.options.getInteger("amount")!;
        const channel = (interaction.options.getChannel("channel") || interaction.channel) as TextChannel;
        const target = interaction.options.getMember("target") as GuildMember;

        const errorEmbed = new EmbedBuilder().setColor("Red");

        if (amount < 1 || amount > 100) {
            return await interaction.reply({
                embeds: [errorEmbed.setDescription(`${Emojis.Cross} Le nombre de messages à supprimer doit être compris entre 1 et 100.`)],
                ephemeral: true,
            });
        }

        const messages: Collection<string, Message<true>> = await channel.messages.fetch({ limit: 100 });

        var filterMessages = target ? messages.filter((m) => m.author.id === target.id) : messages;

        try {
            await channel.bulkDelete(Array.from(filterMessages.keys()).slice(0, amount), true);
        } catch (error) {
            return await interaction.reply({
                embeds: [errorEmbed.setDescription(`${Emojis.Cross} Impossible de supprimer les messages.`)],
                ephemeral: true,
            });
        }

        const guild = await GuildConfig.findOne({ guildId: interaction.guildId });
        const log = guild?.logs?.moderation;

        if (guild && log?.enabled && log?.channelId) {
            ((await interaction.guild?.channels.fetch(log.channelId)) as TextChannel)?.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Orange")
                        .setAuthor({ name: `🧹 Clear de messages${target ? ` | ${target.user.tag}` : ""}` })
                        .setDescription(`Suppression de \`${amount}\` messages${target ? ` de ${target}` : ""} dans ${channel}`)
                        .setTimestamp()
                        .setFooter({
                            text: `Clear effectué par ${interaction.user.tag} - ${interaction.user.id}`,
                            iconURL: interaction.user.displayAvatarURL(),
                        }),
                ],
            });
        }

        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Green")
                    .setDescription(
                        `${Emojis.Tick} Suppression de \`${amount}\` messages${
                            target ? ` (de ${target})` : ""
                        } dans le salon ${channel} effectuée avec succès.`
                    ),
            ],
            ephemeral: true,
        });
    }
}
