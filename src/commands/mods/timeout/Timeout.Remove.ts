import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, GuildMemberRoleManager, TextChannel } from "discord.js";

import CustomClient from "../../../base/classes/CustomClient";
import SubCommand from "../../../base/classes/SubCommand";

import Emojis from "../../../base/enums/Emojis";

import GuildConfig from "../../../base/schemas/GuildConfig";

export default class TimeoutAdd extends SubCommand {
    constructor(client: CustomClient) {
        super(client, {
            name: "timeout.remove",
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const target = interaction.options.getMember("target") as GuildMember;
        const reason = interaction.options.getString("reason") || "Aucun motif donné.";

        const errorEmbed = new EmbedBuilder().setColor("Red");

        if (!target) {
            return await interaction.reply({
                embeds: [errorEmbed.setDescription(`${Emojis.Cross} Vous devez spécifier un membre valide.`)],
                ephemeral: true,
            });
        }
        if (target.id === interaction.user.id) {
            return await interaction.reply({
                embeds: [errorEmbed.setDescription(`${Emojis.Cross} Vous ne pouvez pas retirer votre propre timeout.`)],
                ephemeral: true,
            });
        }
        if (target.roles.highest.position >= (interaction.member?.roles as GuildMemberRoleManager).highest.position) {
            return await interaction.reply({
                embeds: [
                    errorEmbed.setDescription(
                        `${Emojis.Cross} Vous ne pouvez pas retirer le timeout d'un utilisateur avec un rôle égal ou supérieur à votre rôle actuel.`
                    ),
                ],
                ephemeral: true,
            });
        }
        if (target.communicationDisabledUntil == null) {
            return await interaction.reply({
                embeds: [errorEmbed.setDescription(`${Emojis.Cross} ${target} n'a pas de timeout en cours.`)],
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
            await target.timeout(null, reason);
        } catch (error) {
            console.error(error);
            return await interaction.reply({
                embeds: [errorEmbed.setDescription(`${Emojis.Cross} Une erreur est survenue lors de la suppression du timeout.`)],
                ephemeral: true,
            });
        }

        const guild = await GuildConfig.findOne({ guildId: interaction.guildId });
        const log = guild?.logs?.moderation;

        if (guild && log?.enabled && log?.channelId) {
            ((await interaction.guild?.channels.fetch(log.channelId)) as TextChannel)?.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Green")
                        .setThumbnail(target.displayAvatarURL({ size: 64 }))
                        .setAuthor({ name: `⌛ Timeout supprimé | ${target.user.tag}` })
                        .setDescription(
                            `${Emojis.Tick} Le timeout du membre ${target} - \`${target.id}\` a été supprimé !\n\n**Motif** : \`${reason}\``
                        )
                        .setTimestamp()
                        .setFooter({
                            text: `Suppresion de timeout effectuée par ${interaction.user.tag} - ${interaction.user.id}`,
                            iconURL: interaction.user.displayAvatarURL(),
                        }),
                ],
            });
        }

        return await interaction.reply({
            embeds: [new EmbedBuilder().setColor("Green").setDescription(`${Emojis.Tick} Suppression du timeout effectuée avec succès.`)],
            ephemeral: true,
        });
    }
}
