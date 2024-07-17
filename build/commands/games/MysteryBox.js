"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = __importDefault(require("../../base/classes/Command"));
const Category_1 = __importDefault(require("../../base/enums/Category"));
const misterybox_json_1 = __importDefault(require("../../../data/misterybox.json"));
class MysteryBox extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "mysterybox",
            description: "Ouvrir une boîte mystère.",
            category: Category_1.default.Games,
            default_member_permissions: discord_js_1.PermissionFlagsBits.UseApplicationCommands,
            dm_permission: false,
            cooldown: 5 * 60,
            options: [],
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const boxIndex = Math.floor(Math.random() * misterybox_json_1.default.box.length);
            const openedBox = misterybox_json_1.default.box[boxIndex];
            const gameIndex = Math.floor(Math.random() * misterybox_json_1.default.weapons.length);
            const openedGame = misterybox_json_1.default.weapons[gameIndex];
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
                return yield interaction.reply({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor("Red")
                            .setDescription("❌ Erreur lors de l'ouverture de la boîte mystère, veuillez réessayer plus tard."),
                    ],
                    ephemeral: true,
                });
            }
            const weaponIndex = Math.floor(Math.random() * selectedRarity.object.length);
            const openedWeapon = selectedRarity.object[weaponIndex];
            yield interaction.reply({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setTitle("Vous ouvrez une boîte mystère !")
                        .setDescription(`Vous dépensez \`${500}\` crédits pour cette ouverture !`)
                        .setImage(openedBox),
                ],
                ephemeral: true,
            });
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                var _a;
                return yield ((_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.send({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor(`#${selectedRarity.color}`)
                            .setTitle("Boite mystère ouverte !")
                            .setDescription(selectedRarity.xp > 0
                            ? `${interaction.user} a ouvert une boîte mystère et a obtenu un/une \`${openedWeapon.name}\` (${selectedRarity.name}) !\n\nObtention de **${selectedRarity.xp}** points d'expérience !\n\nCette arme provient du jeu \`${openedGame.game}\` !`
                            : `La malédiction de la boîte mystére a frappé ! Les crédits dépensés pour l'ouverture de la boîte par ${interaction.user} ont été perdus et aucuns points d'expérience n'ont été gagnés !`)
                            .setThumbnail(openedBox)
                            .setImage(openedWeapon.url),
                    ],
                }));
            }), 3000);
        });
    }
}
exports.default = MysteryBox;
