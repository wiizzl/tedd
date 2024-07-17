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
class BanAdd extends SubCommand_1.default {
    constructor(client) {
        super(client, {
            name: "ban.add",
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            const target = interaction.options.getMember("target");
            const reason = interaction.options.getString("reason") || "Aucun motif donné.";
            const days = interaction.options.getInteger("days") || 0;
            const silent = interaction.options.getBoolean("silent") || false;
            const errorEmbed = new discord_js_1.EmbedBuilder().setColor("Red");
            if (!target) {
                return yield interaction.reply({
                    embeds: [errorEmbed.setDescription("❌ Vous devez spécifier un membre valide.")],
                    ephemeral: true,
                });
            }
            if (target.id === interaction.user.id) {
                return yield interaction.reply({
                    embeds: [errorEmbed.setDescription("❌ Vous ne pouvez pas vous bannir vous-même.")],
                    ephemeral: true,
                });
            }
            if (target.roles.highest.position >= interaction.member.roles.highest.position) {
                return yield interaction.reply({
                    embeds: [
                        errorEmbed.setDescription("❌ Vous ne pouvez pas bannir un utilisateur avec un rôle égal ou supérieur à votre rôle actuel."),
                    ],
                    ephemeral: true,
                });
            }
            if (!target.bannable) {
                return yield interaction.reply({
                    embeds: [errorEmbed.setDescription("❌ Cet utilisateur ne peut pas être banni.")],
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
                yield target.send({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor("Red")
                            .setDescription(`🔨 Vous avez été **banni** du serveur \`${(_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.name}\` par ${interaction.member}.\n\nSi vous pensez que c'est une erreur, envoyez un message au modérateur vous ayant banni.\n\n**Motif** : \`${reason}\``),
                    ],
                });
                yield target.ban({ deleteMessageSeconds: days, reason: reason });
            }
            catch (error) { }
            const resultEmbed = new discord_js_1.EmbedBuilder()
                .setColor("Red")
                .setThumbnail(target.displayAvatarURL({ size: 64 }))
                .setAuthor({ name: `🔨 Bannissement | ${target.user.tag}` })
                .setDescription(`❌ Le membre ${target} - \`${target.id}\` a été banni du serveur !\n\n${days > 0 && `Les messages des dernières \`${days / 60 / 60} heures\` de ce membre ont été supprimés.`}\n\n**Motif** : \`${reason}\``)
                .setTimestamp();
            if (!silent) {
                yield ((_b = interaction.channel) === null || _b === void 0 ? void 0 : _b.send({
                    embeds: [resultEmbed.setFooter({ text: `ID : ${target.id}` })],
                }).then((message) => __awaiter(this, void 0, void 0, function* () { return yield message.react("🔨"); })));
            }
            const guild = yield GuildConfig_1.default.findOne({ guildId: interaction.guildId });
            const log = (_c = guild === null || guild === void 0 ? void 0 : guild.logs) === null || _c === void 0 ? void 0 : _c.moderation;
            if (guild && (log === null || log === void 0 ? void 0 : log.enabled) && (log === null || log === void 0 ? void 0 : log.channelId)) {
                (_e = ((yield ((_d = interaction.guild) === null || _d === void 0 ? void 0 : _d.channels.fetch(log.channelId))))) === null || _e === void 0 ? void 0 : _e.send({
                    embeds: [
                        resultEmbed.setFooter({
                            text: `Bannissement effectué par ${interaction.user.tag} - ${interaction.user.id}`,
                            iconURL: interaction.user.displayAvatarURL(),
                        }),
                    ],
                });
            }
            return yield interaction.reply({
                embeds: [new discord_js_1.EmbedBuilder().setColor("Green").setDescription("✅ Banissement effectué avec succès.")],
                ephemeral: true,
            });
        });
    }
}
exports.default = BanAdd;
