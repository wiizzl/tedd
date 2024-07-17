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
class BanRemove extends SubCommand_1.default {
    constructor(client) {
        super(client, {
            name: "ban.remove",
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            const target = interaction.options.getString("target");
            const reason = interaction.options.getString("reason") || "Aucun motif donné.";
            const errorEmbed = new discord_js_1.EmbedBuilder().setColor("Red");
            if (reason.length > 512) {
                return yield interaction.reply({
                    embeds: [errorEmbed.setDescription("❌ Ce motif est trop long (max 512 caractères).")],
                    ephemeral: true,
                });
            }
            try {
                yield ((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.bans.fetch(target));
            }
            catch (error) {
                return interaction.reply({
                    embeds: [errorEmbed.setDescription("❌ Ce membre n'est pas banni.")],
                    ephemeral: true,
                });
            }
            try {
                yield ((_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.bans.remove(target, reason));
            }
            catch (error) {
                console.error(error);
                return yield interaction.reply({
                    embeds: [errorEmbed.setDescription("❌ Une erreur est survenue lors du débannissement.")],
                    ephemeral: true,
                });
            }
            const guild = yield GuildConfig_1.default.findOne({ guildId: interaction.guildId });
            const log = (_c = guild === null || guild === void 0 ? void 0 : guild.logs) === null || _c === void 0 ? void 0 : _c.moderation;
            if (guild && (log === null || log === void 0 ? void 0 : log.enabled) && (log === null || log === void 0 ? void 0 : log.channelId)) {
                (_e = ((yield ((_d = interaction.guild) === null || _d === void 0 ? void 0 : _d.channels.fetch(log.channelId))))) === null || _e === void 0 ? void 0 : _e.send({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor("Green")
                            .setAuthor({ name: `🔨 Débannissement | ${target}` })
                            .setDescription(`✅ Le membre avec l'identifiant \`${target}\` a été débanni du serveur !\n\n**Motif** : \`${reason}\``)
                            .setTimestamp()
                            .setFooter({
                            text: `Débannissement effectué par ${interaction.user.tag} - ${interaction.user.id}`,
                            iconURL: interaction.user.displayAvatarURL(),
                        }),
                    ],
                });
            }
            return yield interaction.reply({
                embeds: [new discord_js_1.EmbedBuilder().setColor("Green").setDescription("✅ Débanissement effectué avec succès.")],
                ephemeral: true,
            });
        });
    }
}
exports.default = BanRemove;
