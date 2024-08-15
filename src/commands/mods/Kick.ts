import {
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
    EmbedBuilder,
    GuildMember,
    GuildMemberRoleManager,
    PermissionFlagsBits,
    TextChannel,
} from "discord.js";

import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";

import Category from "../../base/enums/Category";
import Emojis from "../../base/enums/Emojis";

import GuildConfig from "../../base/schemas/GuildConfig";

export default class Kick extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "kick",
            description: "Expulser un utilisateur.",
            category: Category.Moderation,
            default_member_permissions: PermissionFlagsBits.KickMembers,
            dm_permission: false,
            cooldown: 3,
            options: [
                {
                    name: "target",
                    description: "Utilisateur à expulser.",
                    type: ApplicationCommandOptionType.User,
                    required: true,
                },
                {
                    name: "reason",
                    description: "Motif de l'expulsion.",
                    type: ApplicationCommandOptionType.String,
                    required: false,
                },
                {
                    name: "silent",
                    description: "Ne pas envoyer un message dans le salon.",
                    type: ApplicationCommandOptionType.Boolean,
                    required: false,
                },
            ],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const target = interaction.options.getMember("target") as GuildMember;
        const reason = interaction.options.getString("reason") || "Aucun motif donné.";
        const silent = interaction.options.getBoolean("silent") || false;

        const errorEmbed = new EmbedBuilder().setColor("Red");

        if (!target) {
            return await interaction.reply({
                embeds: [errorEmbed.setDescription(`${Emojis.Cross} Vous devez spécifier un membre valide.`)],
                ephemeral: true,
            });
        }
        if (target.id === interaction.user.id) {
            return await interaction.reply({
                embeds: [errorEmbed.setDescription(`${Emojis.Cross} Vous ne pouvez pas vous expulser vous-même.`)],
                ephemeral: true,
            });
        }
        if (target.roles.highest.position >= (interaction.member?.roles as GuildMemberRoleManager).highest.position) {
            return await interaction.reply({
                embeds: [
                    errorEmbed.setDescription(
                        `${Emojis.Cross} Vous ne pouvez pas expulser un utilisateur avec un rôle égal ou supérieur à votre rôle actuel.`
                    ),
                ],
                ephemeral: true,
            });
        }
        if (!target.kickable) {
            return await interaction.reply({
                embeds: [errorEmbed.setDescription(`${Emojis.Cross} Cet utilisateur ne peut pas être expulsé.`)],
                ephemeral: true,
            });
        }
        if (reason.length > 512) {
            return await interaction.reply({
                embeds: [errorEmbed.setDescription(`${Emojis.Cross} Ce motif est trop long (max 512 caractères).`)],
                ephemeral: true,
            });
        }

        try {
            await target.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Orange")
                        .setDescription(
                            `👟 Vous avez été **expulsé** du serveur \`${interaction.guild?.name}\` par ${interaction.member}.\n\nSi vous pensez que c'est une erreur, vous pouvez toujours rejoindre le serveur via une invitation valide.\n\n**Motif** : \`${reason}\``
                        ),
                ],
            });

            await target.kick(reason);
        } catch (error) {}

        const resultEmbed = new EmbedBuilder()
            .setColor("Orange")
            .setThumbnail(target.displayAvatarURL({ size: 64 }))
            .setAuthor({ name: `👟 Expulsion | ${target.user.tag}` })
            .setDescription(`${Emojis.Cross} Le membre ${target} - \`${target.id}\` a été expulsé du serveur !\n\n**Motif** : \`${reason}\``)
            .setTimestamp();

        if (!silent) {
            await interaction.channel
                ?.send({
                    embeds: [resultEmbed.setFooter({ text: `ID : ${target.id}` })],
                })
                .then(async (message) => await message.react("👟"));
        }

        const guild = await GuildConfig.findOne({ guildId: interaction.guildId });
        const log = guild?.logs?.moderation;

        if (guild && log?.enabled && log?.channelId) {
            ((await interaction.guild?.channels.fetch(log.channelId)) as TextChannel)?.send({
                embeds: [
                    resultEmbed.setFooter({
                        text: `Expulsion effectuée par ${interaction.user.tag} - ${interaction.user.id}`,
                        iconURL: interaction.user.displayAvatarURL(),
                    }),
                ],
            });
        }

        return await interaction.reply({
            embeds: [new EmbedBuilder().setColor("Green").setDescription(`${Emojis.Tick} Expulsion effectuée avec succès.`)],
            ephemeral: true,
        });
    }
}
