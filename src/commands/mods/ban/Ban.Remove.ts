import { ChatInputCommandInteraction, EmbedBuilder, TextChannel } from "discord.js";

import CustomClient from "../../../base/classes/CustomClient";
import SubCommand from "../../../base/classes/SubCommand";

import Emojis from "../../../base/enums/Emojis";
import GuildConfig from "../../../base/schemas/GuildConfig";

export default class BanRemove extends SubCommand {
    constructor(client: CustomClient) {
        super(client, {
            name: "ban.remove",
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const target = interaction.options.getString("target");
        const reason = interaction.options.getString("reason") || "Aucun motif donné.";

        const errorEmbed = new EmbedBuilder().setColor("Red");

        if (reason.length > 512) {
            return await interaction.reply({
                embeds: [errorEmbed.setDescription(`${Emojis.Cross} Ce motif est trop long (max 512 caractères).`)],
                ephemeral: true,
            });
        }

        try {
            await interaction.guild?.bans.fetch(target!);
        } catch (error) {
            return interaction.reply({
                embeds: [errorEmbed.setDescription(`${Emojis.Cross} Ce membre n'est pas banni.`)],
                ephemeral: true,
            });
        }

        try {
            await interaction.guild?.bans.remove(target!, reason);
        } catch (error) {
            console.error(error);
            return await interaction.reply({
                embeds: [errorEmbed.setDescription(`${Emojis.Cross} Une erreur est survenue lors du débannissement.`)],
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
                        .setAuthor({ name: `🔨 Débannissement | ${target}` })
                        .setDescription(
                            `${Emojis.Tick} Le membre avec l'identifiant \`${target}\` a été débanni du serveur !\n\n**Motif** : \`${reason}\``
                        )
                        .setTimestamp()
                        .setFooter({
                            text: `Débannissement effectué par ${interaction.user.tag} - ${interaction.user.id}`,
                            iconURL: interaction.user.displayAvatarURL(),
                        }),
                ],
            });
        }

        return await interaction.reply({
            embeds: [new EmbedBuilder().setColor("Green").setDescription(`${Emojis.Tick} Débanissement effectué avec succès.`)],
            ephemeral: true,
        });
    }
}
