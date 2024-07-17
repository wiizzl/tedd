import { ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from "discord.js";

import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";

import Category from "../../base/enums/Category";

import data from "../../../data/misterybox.json";

export default class MysteryBox extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "mysterybox",
            description: "Ouvrir une boîte mystère.",
            category: Category.Games,
            default_member_permissions: PermissionFlagsBits.UseApplicationCommands,
            dm_permission: false,
            cooldown: 5 * 60,
            options: [],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const boxIndex = Math.floor(Math.random() * data.box.length);
        const openedBox = data.box[boxIndex];

        const gameIndex = Math.floor(Math.random() * data.weapons.length);
        const openedGame = data.weapons[gameIndex];

        const totalWeight = openedGame.items.reduce((total, item) => total + item.weight, 0);
        const randomWeight = Math.floor(Math.random() * totalWeight);

        let weightSum = 0;
        let selectedRarity;
        for (const item of openedGame.items) {
            weightSum += item.weight;
            if (randomWeight < weightSum) {
                selectedRarity = item;
                break;
            }
        }

        if (!selectedRarity) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription("❌ Erreur lors de l'ouverture de la boîte mystère, veuillez réessayer plus tard."),
                ],
                ephemeral: true,
            });
        }

        const weaponIndex = Math.floor(Math.random() * selectedRarity.object.length);
        const openedWeapon = selectedRarity.object[weaponIndex];

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Vous ouvrez une boîte mystère !")
                    .setDescription(`Vous dépensez \`${500}\` crédits pour cette ouverture !`)
                    .setImage(openedBox),
            ],
            ephemeral: true,
        });

        setTimeout(async () => {
            return await interaction.channel?.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(`#${selectedRarity.color}`)
                        .setTitle("Boite mystère ouverte !")
                        .setDescription(
                            selectedRarity.xp > 0
                                ? `${interaction.user} a ouvert une boîte mystère et a obtenu un/une \`${openedWeapon.name}\` (${selectedRarity.name}) !\n\nObtention de **${selectedRarity.xp}** points d'expérience !\n\nCette arme provient du jeu \`${openedGame.game}\` !`
                                : `La malédiction de la boîte mystére a frappé ! Les crédits dépensés pour l'ouverture de la boîte par ${interaction.user} ont été perdus et aucuns points d'expérience n'ont été gagnés !`
                        )
                        .setThumbnail(openedBox)
                        .setImage(openedWeapon.url),
                ],
            });
        }, 3000);
    }
}
