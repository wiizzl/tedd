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
const SubCommand_1 = __importDefault(require("../../base/classes/SubCommand"));
const GuildConfig_1 = __importDefault(require("../../base/schemas/GuildConfig"));
class TimeoutAdd extends SubCommand_1.default {
    constructor(client) {
        super(client, {
            name: "timeout.remove",
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const target = interaction.options.getMember("target");
            const reason = interaction.options.getString("reason") || "Aucun motif donné.";
            const errorEmbed = new discord_js_1.EmbedBuilder().setColor("Red");
            if (!target) {
                return yield interaction.reply({
                    embeds: [errorEmbed.setDescription("❌ Vous devez spécifier un membre valide.")],
                    ephemeral: true,
                });
            }
            if (target.id === interaction.user.id) {
                return yield interaction.reply({
                    embeds: [errorEmbed.setDescription("❌ Vous ne pouvez pas retirer votre propre timeout.")],
                    ephemeral: true,
                });
            }
            if (target.roles.highest.position >= ((_a = interaction.member) === null || _a === void 0 ? void 0 : _a.roles).highest.position) {
                return yield interaction.reply({
                    embeds: [
                        errorEmbed.setDescription("❌ Vous ne pouvez pas retirer le timeout d'un utilisateur avec un rôle égal ou supérieur à votre rôle actuel."),
                    ],
                    ephemeral: true,
                });
            }
            if (target.communicationDisabledUntil == null) {
                return yield interaction.reply({
                    embeds: [errorEmbed.setDescription(`❌ ${target} n'a pas de timeout en cours.`)],
                    ephemeral: true,
                });
            }
            if (reason.length > 512) {
                return yield interaction.reply({
                    embeds: [errorEmbed.setDescription("❌ Ce motif est trop long (max 512 caractères).")],
                    ephemeral: true,
                });
            }
            try {
                yield target.timeout(null, reason);
            }
            catch (error) {
                console.error(error);
                return yield interaction.reply({
                    embeds: [errorEmbed.setDescription("❌ Une erreur est survenue lors de la suppression du timeout.")],
                    ephemeral: true,
                });
            }
            const guild = yield GuildConfig_1.default.findOne({ guildId: interaction.guildId });
            const log = (_b = guild === null || guild === void 0 ? void 0 : guild.logs) === null || _b === void 0 ? void 0 : _b.moderation;
            if (guild && (log === null || log === void 0 ? void 0 : log.enabled) && (log === null || log === void 0 ? void 0 : log.channelId)) {
                (_d = ((yield ((_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.channels.fetch(log.channelId))))) === null || _d === void 0 ? void 0 : _d.send({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor("Green")
                            .setThumbnail(target.displayAvatarURL({ size: 64 }))
                            .setAuthor({ name: `⌛ Timeout supprimé | ${target.user.tag}` })
                            .setDescription(`✅ Le timeout du membre ${target} - \`${target.id}\` a été supprimé !\n\n**Motif** : \`${reason}\``)
                            .setTimestamp()
                            .setFooter({
                            text: `Suppresion de timeout effectuée par ${interaction.user.tag} - ${interaction.user.id}`,
                            iconURL: interaction.user.displayAvatarURL(),
                        }),
                    ],
                });
            }
            return yield interaction.reply({
                embeds: [new discord_js_1.EmbedBuilder().setColor("Green").setDescription("✅ Suppression du timeout effectuée avec succès.")],
                ephemeral: true,
            });
        });
    }
}
exports.default = TimeoutAdd;
