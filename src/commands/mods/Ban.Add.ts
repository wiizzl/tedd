import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, GuildMemberRoleManager, TextChannel } from "discord.js";

import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";

import GuildConfig from "../../base/schemas/GuildConfig";

export default class BanAdd extends SubCommand {
    constructor(client: CustomClient) {
        super(client, {
            name: "ban.add",
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const target = interaction.options.getMember("target") as GuildMember;
        const reason = interaction.options.getString("reason") || "Aucun motif donné.";
        const days = interaction.options.getInteger("days") || 0;
        const silent = interaction.options.getBoolean("silent") || false;

        const errorEmbed = new EmbedBuilder().setColor("Red");

        if (!target) {
            return await interaction.reply({
                embeds: [errorEmbed.setDescription("❌ Vous devez spécifier un membre valide.")],
                ephemeral: true,
            });
        }
        if (target.id === interaction.user.id) {
            return await interaction.reply({
                embeds: [errorEmbed.setDescription("❌ Vous ne pouvez pas vous bannir vous-même.")],
                ephemeral: true,
            });
        }
        if (target.roles.highest.position >= (interaction.member!.roles as GuildMemberRoleManager).highest.position) {
            return await interaction.reply({
                embeds: [
                    errorEmbed.setDescription("❌ Vous ne pouvez pas bannir un utilisateur avec un rôle égal ou supérieur à votre rôle actuel."),
                ],
                ephemeral: true,
            });
        }
        if (!target.bannable) {
            return await interaction.reply({
                embeds: [errorEmbed.setDescription("❌ Cet utilisateur ne peut pas être banni.")],
                ephemeral: true,
            });
        }
        if (reason.length > 512) {
            return await interaction.reply({
                embeds: [errorEmbed.setDescription("❌ Ce motif est trop long (max 512 caractères).")],
                ephemeral: true,
            });
        }

        try {
            await target.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(
                            `🔨 Vous avez été **banni** du serveur \`${interaction.guild?.name}\` par ${interaction.member}.\n\nSi vous pensez que c'est une erreur, envoyez un message au modérateur vous ayant banni.\n\n**Motif** : \`${reason}\``
                        ),
                ],
            });

            await target.ban({ deleteMessageSeconds: days, reason: reason });
        } catch (error) {}

        const resultEmbed = new EmbedBuilder()
            .setColor("Red")
            .setThumbnail(target.displayAvatarURL({ size: 64 }))
            .setAuthor({ name: `🔨 Bannissement | ${target.user.tag}` })
            .setDescription(
                `❌ Le membre ${target} - \`${target.id}\` a été banni du serveur !\n\n${
                    days > 0 && `Les messages des dernières \`${days / 60 / 60} heures\` de ce membre ont été supprimés.`
                }\n\n**Motif** : \`${reason}\``
            )
            .setTimestamp();

        if (!silent) {
            await interaction.channel
                ?.send({
                    embeds: [resultEmbed.setFooter({ text: `ID : ${target.id}` })],
                })
                .then(async (message) => await message.react("🔨"));
        }

        const guild = await GuildConfig.findOne({ guildId: interaction.guildId });
        const log = guild?.logs?.moderation;

        if (guild && log?.enabled && log?.channelId) {
            ((await interaction.guild?.channels.fetch(log.channelId)) as TextChannel)?.send({
                embeds: [
                    resultEmbed.setFooter({
                        text: `Bannissement effectué par ${interaction.user.tag} - ${interaction.user.id}`,
                        iconURL: interaction.user.displayAvatarURL(),
                    }),
                ],
            });
        }

        return await interaction.reply({
            embeds: [new EmbedBuilder().setColor("Green").setDescription("✅ Banissement effectué avec succès.")],
            ephemeral: true,
        });
    }
}
