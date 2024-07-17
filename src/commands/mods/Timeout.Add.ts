import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, GuildMemberRoleManager, TextChannel } from "discord.js";
import ms from "ms";

import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";

import GuildConfig from "../../base/schemas/GuildConfig";

export default class TimeoutAdd extends SubCommand {
    constructor(client: CustomClient) {
        super(client, {
            name: "timeout.add",
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const target = interaction.options.getMember("target") as GuildMember;
        const duration = interaction.options.getString("duration") || "5m";
        const reason = interaction.options.getString("reason") || "Aucun motif donné.";
        const silent = interaction.options.getBoolean("silent") || false;
        const msDuration = ms(duration);

        const errorEmbed = new EmbedBuilder().setColor("Red");

        if (!target) {
            return await interaction.reply({
                embeds: [errorEmbed.setDescription("❌ Vous devez spécifier un membre valide.")],
                ephemeral: true,
            });
        }
        if (target.id === interaction.user.id) {
            return await interaction.reply({
                embeds: [errorEmbed.setDescription("❌ Vous ne pouvez pas vous timeout vous-même.")],
                ephemeral: true,
            });
        }
        if (target.roles.highest.position >= (interaction.member?.roles as GuildMemberRoleManager).highest.position) {
            return await interaction.reply({
                embeds: [
                    errorEmbed.setDescription("❌ Vous ne pouvez pas timeout un utilisateur avec un rôle égal ou supérieur à votre rôle actuel."),
                ],
                ephemeral: true,
            });
        }
        if (target.communicationDisabledUntil != null && target.communicationDisabledUntil > new Date()) {
            return await interaction.reply({
                embeds: [
                    errorEmbed.setDescription(
                        `❌ ${target} a déjà un timeout en cours jusqu'à \`${target.communicationDisabledUntil.toLocaleString()}\``
                    ),
                ],
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
                        .setColor("Yellow")
                        .setDescription(
                            `⌛ Vous avez été **timeout** du serveur \`${interaction.guild?.name}\` par ${interaction.member}.\n\nSi vous pensez que c'est une erreur, envoyez un message au modérateur vous ayant timeout.\n\n**Motif** : \`${reason}\``
                        ),
                ],
            });

            await target.timeout(msDuration, reason);
        } catch (error) {}

        const resultEmbed = new EmbedBuilder()
            .setColor("Yellow")
            .setThumbnail(target.displayAvatarURL({ size: 64 }))
            .setAuthor({ name: `⌛ Timeout | ${target.user.tag}` })
            .setDescription(
                `❌ Le membre ${target} - \`${target.id}\` a été timeout du serveur pendant \`${duration}\` !\n\n**Expiration** : <t:${(
                    (Date.now() + msDuration) /
                    1000
                ).toFixed(0)}:F>\n\n**Motif** : \`${reason}\``
            )
            .setTimestamp();

        if (!silent) {
            await interaction.channel
                ?.send({
                    embeds: [resultEmbed.setFooter({ text: `ID : ${target.id}` })],
                })
                .then(async (message) => await message.react("⌛"));
        }

        const guild = await GuildConfig.findOne({ guildId: interaction.guildId });
        const log = guild?.logs?.moderation;

        if (guild && log?.enabled && log?.channelId) {
            ((await interaction.guild?.channels.fetch(log.channelId)) as TextChannel)?.send({
                embeds: [
                    resultEmbed.setFooter({
                        text: `Timeout effectué par ${interaction.user.tag} - ${interaction.user.id}`,
                        iconURL: interaction.user.displayAvatarURL(),
                    }),
                ],
            });
        }

        return await interaction.reply({
            embeds: [new EmbedBuilder().setColor("Green").setDescription("✅ Timeout effectué avec succès.")],
            ephemeral: true,
        });
    }
}
