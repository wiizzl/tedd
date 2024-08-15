import { ChatInputCommandInteraction, EmbedBuilder, TextChannel } from "discord.js";

import CustomClient from "../../../base/classes/CustomClient";
import SubCommand from "../../../base/classes/SubCommand";

import Emojis from "../../../base/enums/Emojis";

import GuildConfig from "../../../base/schemas/GuildConfig";

export default class LogsSet extends SubCommand {
    constructor(client: CustomClient) {
        super(client, {
            name: "logs.set",
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const logType = interaction.options.getString("type");
        const channel = interaction.options.getChannel("channel") as TextChannel;

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

            //@ts-ignore
            guild.logs[`${logType}`].channelId = channel.id;

            await guild.save();

            await channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Green")
                        .setDescription(
                            `${Emojis.Tick} Ce salon est désormais utilisé pour afficher les logs de type \`${logType?.toUpperCase()}\`.`
                        ),
                ],
            });

            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Green")
                        .setDescription(
                            `${
                                Emojis.Tick
                            } Les logs \`${logType?.toUpperCase()}\` ont bien été défini pour s'afficher dans le salon ${channel}.\n\n⚠️​ Les logs ne sont pas activés par défaut. Vous pouvez le faire via la commande \`/logs set\` !`
                        ),
                ],
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
