import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from "discord.js";

import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";

import Category from "../../base/enums/Category";

export default class Rules extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "rules",
            description: "Envoyer l'embed de règlement du serveur.",
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
                    .setTitle("Introduction :")
                    .setAuthor({ name: `Règlement de ${interaction.guild?.name}`, iconURL: interaction.guild?.iconURL()! })
                    .setDescription(
                        `Le règlement est considéré comme lu dès que le joueur rejoint le serveur. L'administration du serveur de ${interaction.guild?.name} se réserve aussi le droit de modifier ses règles à tout moment et sans aucun préavis. Il prend effet dès sa publication dans le canal ${interaction.channel}.`
                    )
                    .setImage("https://i.imgur.com/n58iWxu.png"),
            ],
        });

        await interaction.channel?.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("1. Préambule")
                    .setDescription(
                        `**1.1.** Toutes les actions (de n'importe quel joueur) qui vont à l'encontre du règlement ci-dessous seront sanctionnées par l'équipe de modération, en fonction de la gravité de l'infraction.\n\n**1.2.** Un modérateur a la possibilité d'appliquer une sanction qui n'est pas nommée dans ce règlement dans le cas où un joueur a commis un acte déplacé envers la communauté et/ou le serveur. Il s'inspire alors des sanctions déjà appliquées pour des cas similaires.\n\n**1.3.** Ainsi, nous allons mentionner un certain nombre de règles, d’exemples d’infractions cependant cela n'empêche pas qu'une action non mentionnée ici soit sanctionnée.\n\n**1.4.** La publicité est évidemment interdite, que ce soit pour votre intérêt personnel comme pour celui d'un autre. Tout abus sera sanctionné par un mute voire d'un bannissement en cas de multi-récidive d'une durée qui varie en fonction de la gravité de l'infraction.\n\n**1.5.** Merci de respecter le but des différents salons, tout usage abusif pourra être sanctionné.\n\n**1.6.** L’usurpation d'identité d'un joueur est formellement interdite. Il est aussi formellement interdit de prétendre être quelqu'un que vous n'êtes pas.\n\n**1.7.** Le fait d'éviter une sanction par un quelconque moyen sera sanctionné d'un bannissement définitif du discord.\n\n**1.8.** Votre avatar et votre pseudonyme se doivent d'être corrects, et ne doivent véhiculer aucun message à caractère sexuel, discriminatoire, raciste, homophobe, haineux, violent, xénophobe ou sexiste.\n\n**1.9.** Nous nous réservons le droit de sanctionner la divulgation d'informations si celle-ci se passe sur d'autres plateformes que celles de ${interaction.guild?.name} si la divulgation possède un lien avéré avec ${interaction.guild?.name} de près ou de loin de façon exceptionnelle et après examen et accord de l'administration. De même en cas d'harcèlement ou de situations extrêmes.`
                    ),
            ],
        });

        await interaction.channel?.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("2. Communications écrites")
                    .setDescription(
                        "**2.1.** Nous vous demandons d'avoir des conversations respectueuses et qui ne pourraient pas heurter la sensibilité d'autres joueurs. Les messages à caractère sexuel, discriminatoire, raciste, homophobe, haineux, violent ou xénophobe sont bien évidemment interdits et seront sanctionnés par l'équipe de modération en fonction de la gravité de l'infraction.\n\n**2.2.** De plus, la diffamation est strictement interdite, que ce soit à but volontaire ou involontaire, il est de votre responsabilité de vous renseigner avant d'écrire des choses pouvant nuire à autrui.\n\n**2.3.** Nous n'acceptons pas les débats politiques, religieux et sociaux sur le serveur. De même, tout ce qui peut avoir attrait à de la propagande politique est totalement interdit.\n\n**2.4.** Le flood, le spam ou l'utilisation abusive de majuscules sont interdits. Le spam est seulement toléré lors d'événements qui l'autorisent. Il est interdit de mentionner des grades avec un @ sauf urgence (channel ticket), et il est interdit de mentionner les administrateurs pour des choses totalement inutiles.\n\n**2.5.** Toute diffusion d'informations personnelles (IP, Adresse, Nom réel…) est strictement interdite et est synonyme d'un bannissement définitif du discord.\n\n**2.6.** Les 'spoilers' (mettre un message caché sous un rectangle noir via discord) doivent être utilisés avec la plus grande attention. Ainsi, son abus est prohibé. Il est laissé à l'appréciation de l'équipe de modération de juger l'utilité du spoiler."
                    ),
            ],
        });

        await interaction.channel?.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("3. Communications vocales")
                    .setDescription(
                        "**3.1.** Nous vous demandons de ne pas utiliser de 'soundboard', 'screamer', 'clownfish' ou toute chose pouvant y ressembler dans l'usage, c'est strictement interdit.\n\n**3.2.** Le fait de rejoindre et de partir en boucle, ou de façon répétée, d'un canal vocal est interdit.\n\n**3.3.** De façon évidente, ce qui est interdit en conversation écrite l'est aussi en conversation vocale."
                    ),
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder().setLabel("J'ai lu le règlement").setEmoji("✅").setStyle(ButtonStyle.Success).setCustomId("rules")
                ),
            ],
        });

        return await interaction.reply({
            embeds: [new EmbedBuilder().setColor("Green").setDescription("✅ Règlement envoyé avec succès.")],
            ephemeral: true,
        });
    }
}
