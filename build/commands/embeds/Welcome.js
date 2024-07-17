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
class Welcome extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "welcome",
            description: "Envoyer l'embed de présentation du serveur.",
            category: Category_1.default.Embeds,
            default_member_permissions: discord_js_1.PermissionFlagsBits.Administrator,
            dm_permission: false,
            cooldown: 3,
            options: [],
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            yield ((_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.send({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setTitle("Bienvenue :")
                        .setAuthor({ name: `Présentation de ${(_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.name}`, iconURL: (_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.iconURL() })
                        .setDescription("Bienvenue sur Zombie Zone, la communauté ultime pour les passionnés du mode Zombie des jeux Call of Duty ! Nous sommes dédiés à rassembler les joueurs de tous niveaux et à offrir une plateforme conviviale pour partager des stratégies, découvrir des secrets et, bien sûr, survivre ensemble aux hordes de zombies.")
                        .setImage("https://i.gifer.com/SzW.gif"),
                ],
            }));
            yield ((_d = interaction.channel) === null || _d === void 0 ? void 0 : _d.send({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setTitle("Ce que vous trouverez ici :")
                        .setDescription("**Une communauté accueillante** :\nQue vous soyez un vétéran aguerri ou un nouveau joueur curieux, L'équipe est la communauté de Zombie Zone est la pour vous soutenir. Participez aux discussions, trouvez des partenaires de jeu et échangez des astuces et des conseils.\n\n**Des guides et des stratégies** :\nProfitez de l’expertise collective de nos membres pour améliorer votre gameplay. Nous partageons des guides détaillés et des stratégies éprouvées pour toutes les cartes zombies.\n\n**Du support et de l'assistance** :\nBesoin d’aide pour un Easter egg ou un défi particulier? Notre communauté est là pour vous soutenir. Posez vos questions et obtenez des réponses rapides et utiles.\n\n**Des informations sur les cartes** :\nAccédez à des descriptions détaillées de toutes les cartes zombies disponibles dans les jeux Call of Duty, avec des guides sur les secrets, les Easter eggs et plus encore.\n\n**Des actualités et des mises à jour** :\nRestez informé des dernières nouvelles et mises à jour concernant le mode Zombie. Nous couvrons les annonces officielles, les nouvelles cartes, et les ajouts de contenu.\n\n**Une communauté et un forum** :\nParticipez aux discussions sur nos forums pour échanger des idées, partager vos expériences et obtenir des conseils de la part d'autres fans de zombies.\n\n**Des vidéos et des tutoriels** :\nVisionnez des vidéos et des tutoriels réalisés par des experts de la communauté pour vous aider à maîtriser chaque aspect du mode Zombie."),
                ],
            }));
            yield ((_e = interaction.channel) === null || _e === void 0 ? void 0 : _e.send({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setDescription("Ne manquez pas l'opportunité de faire partie de cette communauté passionnée et dynamique. Rejoignez Zombie Zone dès aujourd'hui et préparez-vous à affronter les hordes de zombies avec nous !")
                        .setFooter({ text: "À bientôt sur Zombie Zone !" }),
                ],
            }));
            return yield interaction.reply({
                embeds: [new discord_js_1.EmbedBuilder().setColor("Green").setDescription("✅ Présentation envoyée avec succès.")],
                ephemeral: true,
            });
        });
    }
}
exports.default = Welcome;
