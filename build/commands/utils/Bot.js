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
const ms_1 = __importDefault(require("ms"));
const os_1 = __importDefault(require("os"));
const Command_1 = __importDefault(require("../../base/classes/Command"));
const Category_1 = __importDefault(require("../../base/enums/Category"));
const package_json_1 = require("../../../package.json");
class Bot extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "bot",
            description: "Afficher les informations sur le robot.",
            category: Category_1.default.Utilities,
            default_member_permissions: discord_js_1.PermissionFlagsBits.UseApplicationCommands,
            dm_permission: true,
            cooldown: 3,
            options: [],
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            return yield interaction.reply({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setColor(this.client.config.color)
                        .setThumbnail((_a = this.client.user) === null || _a === void 0 ? void 0 : _a.displayAvatarURL())
                        .setDescription(`
                        **Robot** :
                        > ID : \`${(_b = this.client.user) === null || _b === void 0 ? void 0 : _b.id}\`
                        > Création du compte : <t:${parseInt((this.client.user.createdTimestamp / 1000).toFixed(0))}:R>
                        > Commandes : \`${this.client.commands.size}\`
                        > Version : \`${package_json_1.version}\`
                        > Version de NodeJS : \`${process.version}\`
                        > Dépendances (${Object.keys(package_json_1.dependencies).length}) : \`${Object.keys(package_json_1.dependencies)
                        // @ts-ignore
                        .map((d) => `${d}@${package_json_1.dependencies[d]}`.replace(/\^/g, ""))
                        .join(", ")}\`
                        > Temps d'allumage : \`${(0, ms_1.default)(this.client.uptime, { long: false })}\`

                        **Système** :
                        > Système d'exploitation : \`${process.platform}\`
                        > CPU : \`${os_1.default.cpus()[0].model.trim()}\`
                        > Utilisation de la mémoire: \`${this.formatBytes(process.memoryUsage().heapUsed)}\` / \`${this.formatBytes(os_1.default.totalmem())}\`

                        **Équipe de développement** :
                        > Propriétaire : \`Serveur Zombie Zone\`
                        > Développeur : \`wiizz\`
                        `),
                ],
                components: [
                    new discord_js_1.ActionRowBuilder().addComponents([
                        new discord_js_1.ButtonBuilder().setLabel("Site web").setStyle(discord_js_1.ButtonStyle.Link).setURL("https://zombie-zone.net"),
                        new discord_js_1.ButtonBuilder().setLabel("Discord").setStyle(discord_js_1.ButtonStyle.Link).setURL("https://discord.gg/zngVd8pczz"),
                    ]),
                ],
                ephemeral: true,
            });
        });
    }
    formatBytes(bytes) {
        if (bytes == 0)
            return "0";
        const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
    }
}
exports.default = Bot;
