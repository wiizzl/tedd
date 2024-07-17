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
class User extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "user",
            description: "Avoir des informations sur un utilisateur.",
            category: Category_1.default.Utilities,
            default_member_permissions: discord_js_1.PermissionFlagsBits.UseApplicationCommands,
            dm_permission: false,
            cooldown: 3,
            options: [
                {
                    name: "target",
                    description: "Utilisateur dont afficher les informations.",
                    type: discord_js_1.ApplicationCommandOptionType.User,
                    required: false,
                },
            ],
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const target = (interaction.options.getMember("target") || interaction.member);
            yield interaction.deferReply({ ephemeral: true });
            const fetchMember = yield target.fetch();
            return yield interaction.editReply({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setColor((_a = fetchMember.user.accentColor) !== null && _a !== void 0 ? _a : this.client.config.color)
                        .setAuthor({ name: `${fetchMember.user.tag}`, iconURL: fetchMember.user.displayAvatarURL() })
                        .setThumbnail(fetchMember.user.displayAvatarURL())
                        .setDescription(`
                        **Utilisateur** :
                        > ID : \`${fetchMember.user.id}\`
                        > Robot : \`${fetchMember.user.bot ? "Oui" : "Non"}\`
                        > Création du compte : <t:${parseInt((fetchMember.user.createdTimestamp / 1000).toFixed(0))}:R>

                        **Membre** :
                        > Surnom : \`${fetchMember.nickname || fetchMember.user.username}\`
                        > Rôles (${fetchMember.roles.cache.size - 1}) : ${fetchMember.roles.cache
                        .map((role) => role)
                        .join(", ")
                        .replace("@everyone", "") || "Aucun"}
                        > Administrateur : \`${fetchMember.permissions.has(discord_js_1.PermissionFlagsBits.Administrator) ? "Oui" : "Non"}\`
                        > Rejoint le serveur : <t:${parseInt((fetchMember.joinedTimestamp / 1000).toFixed(0))}:R>
                        > Position : \`${this.GetJoinPosition(interaction, fetchMember) + 1}\` / \`${(_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.memberCount}\`
                        `),
                ],
            });
        });
    }
    GetJoinPosition(interaction, target) {
        var _a;
        let pos = null;
        const joinPosition = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.members.cache.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp);
        Array.from(joinPosition).find((member, index) => {
            if (member[0] == target.user.id) {
                pos = index;
            }
        });
        return pos;
    }
}
exports.default = User;
