import { ButtonInteraction, ComponentType, EmbedBuilder, PermissionFlagsBits } from "discord.js";

import CustomClient from "../../../base/classes/CustomClient";
import Interaction from "../../../base/classes/Interaction";

import UserConfig from "../../../base/schemas/UserConfig";

import data from "../../../../data/misterybox.json";
import { getLevelXp } from "../../../utils/getLevel";

export default class Box extends Interaction {
    constructor(client: CustomClient) {
        super(client, {
            name: "panel_box",
            permissions: PermissionFlagsBits.UseApplicationCommands,
            cooldown: 5 * 60,
            type: ComponentType.Button,
        });
    }

    async Execute(interaction: ButtonInteraction) {
        let weaponExists = false;

        const userDB = await UserConfig.findOne({ userId: interaction.user.id, guildId: interaction.guild?.id });

        const boxIndex = Math.floor(Math.random() * data.box.length);
        const openedBox = data.box[boxIndex];
        const boxPrice = 950;

        if (userDB?.credit! < boxPrice || userDB?.credit === undefined) {
            return await interaction.reply({
                embeds: [new EmbedBuilder().setColor("Red").setDescription("❌ Vous n'avez pas assez de crédit pour ouvrir une boîte mystère.")],
                ephemeral: true,
            });
        }

        if (userDB?.inventory.content.length! >= (userDB?.inventory.size! || 50)) {
            return await interaction.reply({
                embeds: [new EmbedBuilder().setColor("Red").setDescription("❌ Votre inventaire est plein.")],
                ephemeral: true,
            });
        }

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

        const replyMessage = await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(interaction.message.embeds[0].color)
                    .setAuthor({ name: "Ouverture d'une boîte mystère !", iconURL: "https://i.imgur.com/e0XQD81.png" })
                    .setDescription(`${interaction.user} a dépensé \`${boxPrice}\` crédits pour cette ouverture.`)
                    .setImage(openedBox),
            ],
        });

        setTimeout(async () => {
            try {
                userDB.credit -= boxPrice;
                userDB.level.xp += selectedRarity.xp;

                if (userDB.level.xp >= getLevelXp(userDB.level.level)) {
                    userDB!.level.xp = 0;
                    userDB!.level.level += 1;
                    userDB!.credit += getLevelXp(userDB.level.level) / 2;

                    interaction.message.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(this.client.config.color)
                                .setAuthor({ name: "Niveau supérieur !", iconURL: "https://i.imgur.com/wiXvc3C.png" })
                                .setDescription(
                                    `Bravo ${interaction.user}, vous venez de passer au niveau \`${userDB!.level.level}\` ! Vous gagnez \`${
                                        getLevelXp(userDB.level.level) / 2
                                    }\` crédits !`
                                ),
                        ],
                    });
                }

                userDB.inventory.content.forEach((item) => {
                    if (item.name === openedWeapon.name) {
                        item.quantity += 1;
                        weaponExists = true;
                    }
                });
                if (!weaponExists) {
                    userDB.inventory.content.push({
                        rarity: selectedRarity.name,
                        name: openedWeapon.name,
                        quantity: 1,
                    });
                }

                userDB.save();

                return await replyMessage
                    .edit({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(`#${selectedRarity.color}`)
                                .setAuthor({ name: "Boite mystère ouverte !", iconURL: "https://i.imgur.com/e0XQD81.png" })
                                .setDescription(
                                    selectedRarity.xp > 0
                                        ? `${interaction.user} a ouvert une boîte mystère et a obtenu un/une \`${openedWeapon.name}\` (${
                                              selectedRarity.name.split(" ")[1]
                                          }) !\n\nObtention de **${selectedRarity.xp}** points d'expérience !\n\nCette arme provient du jeu \`${
                                              openedGame.game
                                          }\` !`
                                        : `La malédiction de la boîte mystére a frappé ! Les crédits dépensés pour l'ouverture de la boîte par ${interaction.user} ont été perdus et aucuns points d'expérience n'ont été gagnés !`
                                )
                                .setThumbnail(openedBox)
                                .setImage(openedWeapon.url),
                        ],
                    })
                    .then(async (message) => {
                        await message.react("🤩");
                        await message.react("💩");
                    });
            } catch (error) {
                console.error(error);
            }
        }, 3000);
    }
}
