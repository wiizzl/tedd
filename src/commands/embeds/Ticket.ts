import { ActionRowBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, StringSelectMenuBuilder } from "discord.js";

import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";

import Category from "../../base/enums/Category";

export default class Ticket extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "ticket",
            description: "Envoyer l'embed de ticket.",
            category: Category.Embeds,
            default_member_permissions: PermissionFlagsBits.Administrator,
            dm_permission: false,
            cooldown: 3,
            options: [],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        await interaction.channel?.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Vous souhaitez ouvrir un ticket ?")
                    .setDescription(
                        "### Comment l'utiliser ?\nIl vous suffit de choisir une des catégories ci-dessous afin d'accèder à un channel privé. Par la suite, un membre de notre équipe s'occupera de vous dans les plus bref délais."
                    )
                    .setThumbnail(interaction.guild?.iconURL()!),
            ],
            components: [
                new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId("ticket")
                        .setPlaceholder("Choisir un type de ticket.")
                        .addOptions([
                            {
                                label: "Plainte staff",
                                value: "Plainte staff",
                                description: "Si un membre du staff a réalisé une action qui vous semble anormale, injuste, ...",
                                emoji: "❗",
                            },
                            {
                                label: "Plainte membre",
                                value: "Plainte membre",
                                description: "Si un membre du serveur a réalisé une action qui ne suit pas le réglement du serveur.",
                                emoji: "❕",
                            },
                            {
                                label: "Bug",
                                value: "Bug",
                                description: "Si vous avez recontré un problème sur notre écosystème (serveur, robot, site web, ...).",
                                emoji: "💻",
                            },
                            {
                                label: "Recrutement",
                                value: "Recrutement",
                                description: "Si vous souhaitez postuler au poste de staff.",
                                emoji: "👔",
                            },
                            {
                                label: "Autre",
                                value: "Autre",
                                description: "Si vous avez une toute autre demande, quelle qu'elle soit.",
                                emoji: "❓",
                            },
                        ])
                ),
            ],
        });

        return await interaction.reply({
            embeds: [new EmbedBuilder().setColor("Green").setDescription("✅ Ticket envoyé avec succès.")],
            ephemeral: true,
        });
    }
}
