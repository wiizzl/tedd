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
class Ticket extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "ticket",
            description: "Envoyer l'embed de ticket.",
            category: Category_1.default.Embeds,
            default_member_permissions: discord_js_1.PermissionFlagsBits.Administrator,
            dm_permission: false,
            cooldown: 3,
            options: [],
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            yield ((_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.send({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setTitle("Vous souhaitez ouvrir un ticket ?")
                        .setDescription("### Comment l'utiliser ?\nIl vous suffit de choisir une des catégories ci-dessous afin d'accèder à un channel privé. Par la suite, un membre de notre équipe s'occupera de vous dans les plus bref délais.")
                        .setThumbnail((_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.iconURL()),
                ],
                components: [
                    new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.StringSelectMenuBuilder()
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
                    ])),
                ],
            }));
            return yield interaction.reply({
                embeds: [new discord_js_1.EmbedBuilder().setColor("Green").setDescription("✅ Ticket envoyé avec succès.")],
                ephemeral: true,
            });
        });
    }
}
exports.default = Ticket;
