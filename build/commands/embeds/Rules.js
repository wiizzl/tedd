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
class Rules extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "rules",
            description: "Envoyer l'embed de règlement du serveur.",
            category: Category_1.default.Embeds,
            default_member_permissions: discord_js_1.PermissionFlagsBits.Administrator,
            dm_permission: false,
            cooldown: 3,
            options: [],
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            yield ((_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.send({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setTitle("Introduction :")
                        .setAuthor({ name: `Règlement de ${(_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.name}`, iconURL: (_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.iconURL() })
                        .setDescription(`Le règlement est considéré comme lu dès que le joueur rejoint le serveur. L'administration du serveur de ${(_d = interaction.guild) === null || _d === void 0 ? void 0 : _d.name} se réserve aussi le droit de modifier ses règles à tout moment et sans aucun préavis. Il prend effet dès sa publication dans le canal ${interaction.channel}.`)
                        .setImage("https://i.imgur.com/n58iWxu.png"),
                ],
            }));
            yield ((_e = interaction.channel) === null || _e === void 0 ? void 0 : _e.send({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setTitle("1. Préambule")
                        .setDescription(`**1.1.** Toutes les actions (de n'importe quel joueur) qui vont à l'encontre du règlement ci-dessous seront sanctionnées par l'équipe de modération, en fonction de la gravité de l'infraction.\n\n**1.2.** Un modérateur a la possibilité d'appliquer une sanction qui n'est pas nommée dans ce règlement dans le cas où un joueur a commis un acte déplacé envers la communauté et/ou le serveur. Il s'inspire alors des sanctions déjà appliquées pour des cas similaires.\n\n**1.3.** Ainsi, nous allons mentionner un certain nombre de règles, d’exemples d’infractions cependant cela n'empêche pas qu'une action non mentionnée ici soit sanctionnée.\n\n**1.4.** La publicité est évidemment interdite, que ce soit pour votre intérêt personnel comme pour celui d'un autre. Tout abus sera sanctionné par un mute voire d'un bannissement en cas de multi-récidive d'une durée qui varie en fonction de la gravité de l'infraction.\n\n**1.5.** Merci de respecter le but des différents salons, tout usage abusif pourra être sanctionné.\n\n**1.6.** L’usurpation d'identité d'un joueur est formellement interdite. Il est aussi formellement interdit de prétendre être quelqu'un que vous n'êtes pas.\n\n**1.7.** Le fait d'éviter une sanction par un quelconque moyen sera sanctionné d'un bannissement définitif du discord.\n\n**1.8.** Votre avatar et votre pseudonyme se doivent d'être corrects, et ne doivent véhiculer aucun message à caractère sexuel, discriminatoire, raciste, homophobe, haineux, violent, xénophobe ou sexiste.\n\n**1.9.** Nous nous réservons le droit de sanctionner la divulgation d'informations si celle-ci se passe sur d'autres plateformes que celles de ${(_f = interaction.guild) === null || _f === void 0 ? void 0 : _f.name} si la divulgation possède un lien avéré avec ${(_g = interaction.guild) === null || _g === void 0 ? void 0 : _g.name} de près ou de loin de façon exceptionnelle et après examen et accord de l'administration. De même en cas d'harcèlement ou de situations extrêmes.`),
                ],
            }));
            yield ((_h = interaction.channel) === null || _h === void 0 ? void 0 : _h.send({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setTitle("2. Communications écrites")
                        .setDescription("**2.1.** Nous vous demandons d'avoir des conversations respectueuses et qui ne pourraient pas heurter la sensibilité d'autres joueurs. Les messages à caractère sexuel, discriminatoire, raciste, homophobe, haineux, violent ou xénophobe sont bien évidemment interdits et seront sanctionnés par l'équipe de modération en fonction de la gravité de l'infraction.\n\n**2.2.** De plus, la diffamation est strictement interdite, que ce soit à but volontaire ou involontaire, il est de votre responsabilité de vous renseigner avant d'écrire des choses pouvant nuire à autrui.\n\n**2.3.** Nous n'acceptons pas les débats politiques, religieux et sociaux sur le serveur. De même, tout ce qui peut avoir attrait à de la propagande politique est totalement interdit.\n\n**2.4.** Le flood, le spam ou l'utilisation abusive de majuscules sont interdits. Le spam est seulement toléré lors d'événements qui l'autorisent. Il est interdit de mentionner des grades avec un @ sauf urgence (channel ticket), et il est interdit de mentionner les administrateurs pour des choses totalement inutiles.\n\n**2.5.** Toute diffusion d'informations personnelles (IP, Adresse, Nom réel…) est strictement interdite et est synonyme d'un bannissement définitif du discord.\n\n**2.6.** Les 'spoilers' (mettre un message caché sous un rectangle noir via discord) doivent être utilisés avec la plus grande attention. Ainsi, son abus est prohibé. Il est laissé à l'appréciation de l'équipe de modération de juger l'utilité du spoiler."),
                ],
            }));
            yield ((_j = interaction.channel) === null || _j === void 0 ? void 0 : _j.send({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setTitle("3. Communications vocales")
                        .setDescription("**3.1.** Nous vous demandons de ne pas utiliser de 'soundboard', 'screamer', 'clownfish' ou toute chose pouvant y ressembler dans l'usage, c'est strictement interdit.\n\n**3.2.** Le fait de rejoindre et de partir en boucle, ou de façon répétée, d'un canal vocal est interdit.\n\n**3.3.** De façon évidente, ce qui est interdit en conversation écrite l'est aussi en conversation vocale."),
                ],
                components: [
                    new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setLabel("J'ai lu le règlement").setEmoji("✅").setStyle(discord_js_1.ButtonStyle.Success).setCustomId("rules")),
                ],
            }));
            return yield interaction.reply({
                embeds: [new discord_js_1.EmbedBuilder().setColor("Green").setDescription("✅ Règlement envoyé avec succès.")],
                ephemeral: true,
            });
        });
    }
}
exports.default = Rules;
