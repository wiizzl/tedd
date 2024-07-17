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
class Help extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "help",
            description: "Afficher le message d'aide.",
            category: Category_1.default.Utilities,
            default_member_permissions: discord_js_1.PermissionFlagsBits.UseApplicationCommands,
            dm_permission: true,
            cooldown: 3,
            options: [],
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let categories = [];
            this.client.commands.forEach((command) => {
                if (!categories.includes(command.category)) {
                    categories.push(command.category);
                }
            });
            const Embed = new discord_js_1.EmbedBuilder()
                .setColor(this.client.config.color)
                .setTitle("Liste des commandes :")
                .setThumbnail((_a = this.client.user) === null || _a === void 0 ? void 0 : _a.displayAvatarURL())
                .setDescription(`Commandes : \`${this.client.commands.size}\`\nCatégories : \`${categories.length}\``);
            categories.sort().forEach((cat) => __awaiter(this, void 0, void 0, function* () {
                const commands = this.client.commands.filter((cmd) => cmd.category === cat);
                Embed.addFields({
                    name: `${cat} :`,
                    value: `${commands.map((cmd) => `\`${cmd.name}\` : ${cmd.description}`).join("\n")}`,
                });
            }));
            return yield interaction.reply({ embeds: [Embed], ephemeral: true });
        });
    }
}
exports.default = Help;
