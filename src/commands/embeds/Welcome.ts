import { ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from "discord.js";

import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";

import Category from "../../base/enums/Category";
import Emojis from "../../base/enums/Emojis";

export default class Welcome extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "welcome",
            description: "Envoyer l'embed de présentation du serveur.",
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
                    .setTitle("Bienvenue :")
                    .setColor(this.client.config.color)
                    .setAuthor({ name: `Présentation de ${interaction.guild?.name}`, iconURL: interaction.guild?.iconURL()! })
                    .setDescription(
                        `Bienvenue sur ${interaction.guild?.name}, la communauté ultime pour les passionnés du mode Zombie des jeux Call of Duty ! Nous sommes dédiés à rassembler les joueurs de tous niveaux et à offrir une plateforme conviviale pour partager des stratégies, découvrir des secrets et, bien sûr, survivre ensemble aux hordes de zombies.`
                    )
                    .setImage("https://i.gifer.com/SzW.gif"),
            ],
        });

        await interaction.channel?.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Ce que vous trouverez ici :")
                    .setColor(this.client.config.color)
                    .addFields([
                        {
                            name: "Une communauté accueillante :",
                            value: `Que vous soyez un vétéran aguerri ou un nouveau joueur curieux, L'équipe est la communauté de ${interaction.guild?.name} est la pour vous soutenir. Participez aux discussions, trouvez des partenaires de jeu et échangez des astuces et des conseils.`,
                        },
                        {
                            name: "Des guides et des stratégies :",
                            value: "Profitez de l'expertise collective de nos membres pour améliorer votre gameplay. Nous partageons des guides détaillés et des stratégies éprouvées pour toutes les cartes zombies.",
                        },
                        {
                            name: "Du support et de l'assistance :",
                            value: "Besoin d'aide pour un Easter egg ou un défi particulier? Notre communauté est là pour vous soutenir. Posez vos questions et obtenez des réponses rapides et utiles.",
                        },
                        {
                            name: "Des informations sur les cartes :",
                            value: "Accédez à des descriptions détaillées de toutes les cartes zombies disponibles dans les jeux Call of Duty, avec des guides sur les secrets, les Easter eggs et plus encore.",
                        },
                        {
                            name: "Des actualités et des mises à jour :",
                            value: "Restez informé des dernières nouvelles et mises à jour concernant le mode Zombie. Nous couvrons les annonces officielles, les nouvelles cartes, et les ajouts de contenu.",
                        },
                        {
                            name: "Une communauté et un forum :",
                            value: "Participez aux discussions sur nos forums pour échanger des idées, partager vos expériences et obtenir des conseils de la part d'autres fans de zombies.",
                        },
                        {
                            name: "Des vidéos et des tutoriels :",
                            value: "Visionnez des vidéos et des tutoriels réalisés par des experts de la communauté pour vous aider à maîtriser chaque aspect du mode Zombie.",
                        },
                    ]),
            ],
        });

        await interaction.channel?.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(this.client.config.color)
                    .setDescription(
                        `Ne manquez pas l'opportunité de faire partie de cette communauté passionnée et dynamique. Rejoignez ${interaction.guild?.name} dès aujourd'hui et préparez-vous à affronter les hordes de zombies avec nous !`
                    )
                    .setFooter({ text: `À bientôt sur ${interaction.guild?.name} !` }),
            ],
        });

        return await interaction.reply({
            embeds: [new EmbedBuilder().setColor("Green").setDescription(`${Emojis.Tick} Présentation envoyée avec succès.`)],
            ephemeral: true,
        });
    }
}
