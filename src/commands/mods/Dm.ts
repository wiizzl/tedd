import {
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits,
} from "discord.js";

import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";

import Category from "../../base/enums/Category";
import Emojis from "../../base/enums/Emojis";

export default class Clear extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "dm",
            description: "Envoyer un message privé à un utilisateur.",
            category: Category.Moderation,
            cooldown: 5,
            dm_permission: false,
            default_member_permissions: PermissionFlagsBits.ModerateMembers,
            options: [
                {
                    name: "message",
                    description: "Le message à envoyer.",
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: "membre",
                    description: "Le membre à qui envoyer le message.",
                    type: ApplicationCommandOptionType.User,
                    required: true,
                },
            ],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const message = interaction.options.getString("message");
        const user = interaction.options.getUser("membre");

        try {
            await user?.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(this.client.config.color)
                        .setDescription(message)
                        .setFooter({
                            text: `Envoyé par ${interaction.user.username} en provenance du serveur ${interaction.guild?.name}`,
                            iconURL: interaction.guild?.iconURL()!,
                        }),
                ],
            });

            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor("Green").setDescription(`${Emojis.Tick} Message envoyé avec succès.`),
                ],
                ephemeral: true,
            });
        } catch {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(
                            `${Emojis.Cross} Erreur lors de l'envoi du message. Le membre a peut-être ses messages privés désactivés.`
                        ),
                ],
                ephemeral: true,
            });
        }
    }
}
