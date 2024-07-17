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
const discord_arts_1 = require("discord-arts");
const discord_js_1 = require("discord.js");
const Command_1 = __importDefault(require("../../base/classes/Command"));
const Category_1 = __importDefault(require("../../base/enums/Category"));
class Profile extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "profile",
            description: "Afficher le profil d'un utilisateur.",
            category: Category_1.default.Utilities,
            default_member_permissions: discord_js_1.PermissionFlagsBits.UseApplicationCommands,
            dm_permission: false,
            cooldown: 3,
            options: [
                {
                    name: "target",
                    description: "Utilisateur dont afficher le profil.",
                    type: discord_js_1.ApplicationCommandOptionType.User,
                    required: false,
                },
            ],
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const target = (interaction.options.getMember("target") || interaction.member);
            yield interaction.deferReply({ ephemeral: true });
            const buffer = yield (0, discord_arts_1.profileImage)(target.id, {
                badgesFrame: true,
                removeAvatarFrame: false,
                presenceStatus: (_a = target.presence) === null || _a === void 0 ? void 0 : _a.status,
            });
            const attachment = new discord_js_1.AttachmentBuilder(buffer).setName(`${target.user.username}_profile.png`);
            const colour = (yield target.user.fetch()).accentColor;
            return yield interaction.editReply({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setColor(colour !== null && colour !== void 0 ? colour : this.client.config.color)
                        .setDescription(`Profile de ${target}`)
                        .setImage(`attachment://${target.user.username}_profile.png`),
                ],
                files: [attachment],
            });
        });
    }
}
exports.default = Profile;
