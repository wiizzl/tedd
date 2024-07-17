import { ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from "discord.js";

import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";

import Category from "../../base/enums/Category";

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
                    .setAuthor({ name: `Présentation de ${interaction.guild?.name}`, iconURL: interaction.guild?.iconURL()! })
                    .setDescription(
                        "Bienvenue sur Zombie Zone, la communauté ultime pour les passionnés du mode Zombie des jeux Call of Duty ! Nous sommes dédiés à rassembler les joueurs de tous niveaux et à offrir une plateforme conviviale pour partager des stratégies, découvrir des secrets et, bien sûr, survivre ensemble aux hordes de zombies."
                    )
                    .setImage("https://i.gifer.com/SzW.gif"),
            ],
        });

        await interaction.channel?.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Ce que vous trouverez ici :")
                    .setDescription(
                        "**Une communauté accueillante** :\nQue vous soyez un vétéran aguerri ou un nouveau joueur curieux, L'équipe est la communauté de Zombie Zone est la pour vous soutenir. Participez aux discussions, trouvez des partenaires de jeu et échangez des astuces et des conseils.\n\n**Des guides et des stratégies** :\nProfitez de l’expertise collective de nos membres pour améliorer votre gameplay. Nous partageons des guides détaillés et des stratégies éprouvées pour toutes les cartes zombies.\n\n**Du support et de l'assistance** :\nBesoin d’aide pour un Easter egg ou un défi particulier? Notre communauté est là pour vous soutenir. Posez vos questions et obtenez des réponses rapides et utiles.\n\n**Des informations sur les cartes** :\nAccédez à des descriptions détaillées de toutes les cartes zombies disponibles dans les jeux Call of Duty, avec des guides sur les secrets, les Easter eggs et plus encore.\n\n**Des actualités et des mises à jour** :\nRestez informé des dernières nouvelles et mises à jour concernant le mode Zombie. Nous couvrons les annonces officielles, les nouvelles cartes, et les ajouts de contenu.\n\n**Une communauté et un forum** :\nParticipez aux discussions sur nos forums pour échanger des idées, partager vos expériences et obtenir des conseils de la part d'autres fans de zombies.\n\n**Des vidéos et des tutoriels** :\nVisionnez des vidéos et des tutoriels réalisés par des experts de la communauté pour vous aider à maîtriser chaque aspect du mode Zombie."
                    ),
            ],
        });

        await interaction.channel?.send({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        "Ne manquez pas l'opportunité de faire partie de cette communauté passionnée et dynamique. Rejoignez Zombie Zone dès aujourd'hui et préparez-vous à affronter les hordes de zombies avec nous !"
                    )
                    .setFooter({ text: "À bientôt sur Zombie Zone !" }),
            ],
        });

        return await interaction.reply({
            embeds: [new EmbedBuilder().setColor("Green").setDescription("✅ Présentation envoyée avec succès.")],
            ephemeral: true,
        });
    }
}
