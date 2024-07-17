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
const SubCommand_1 = __importDefault(require("../../base/classes/SubCommand"));
const GuildConfig_1 = __importDefault(require("../../base/schemas/GuildConfig"));
class TimeoutAdd extends SubCommand_1.default {
    constructor(client) {
        super(client, {
            name: "timeout.add",
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            const target = interaction.options.getMember("target");
            const duration = interaction.options.getString("duration") || "5m";
            const reason = interaction.options.getString("reason") || "Aucun motif donné.";
            const silent = interaction.options.getBoolean("silent") || false;
            const msDuration = (0, ms_1.default)(duration);
            const errorEmbed = new discord_js_1.EmbedBuilder().setColor("Red");
            if (!target) {
                return yield interaction.reply({
                    embeds: [errorEmbed.setDescription("❌ Vous devez spécifier un membre valide.")],
                    ephemeral: true,
                });
            }
            if (target.id === interaction.user.id) {
                return yield interaction.reply({
                    embeds: [errorEmbed.setDescription("❌ Vous ne pouvez pas vous timeout vous-même.")],
                    ephemeral: true,
                });
            }
            if (target.roles.highest.position >= ((_a = interaction.member) === null || _a === void 0 ? void 0 : _a.roles).highest.position) {
                return yield interaction.reply({
                    embeds: [
                        errorEmbed.setDescription("❌ Vous ne pouvez pas timeout un utilisateur avec un rôle égal ou supérieur à votre rôle actuel."),
                    ],
                    ephemeral: true,
                });
            }
            if (target.communicationDisabledUntil != null && target.communicationDisabledUntil > new Date()) {
                return yield interaction.reply({
                    embeds: [
                        errorEmbed.setDescription(`❌ ${target} a déjà un timeout en cours jusqu'à \`${target.communicationDisabledUntil.toLocaleString()}\``),
                    ],
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
                            .setColor("Yellow")
                            .setDescription(`⌛ Vous avez été **timeout** du serveur \`${(_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.name}\` par ${interaction.member}.\n\nSi vous pensez que c'est une erreur, envoyez un message au modérateur vous ayant timeout.\n\n**Motif** : \`${reason}\``),
                    ],
                });
                yield target.timeout(msDuration, reason);
            }
            catch (error) { }
            const resultEmbed = new discord_js_1.EmbedBuilder()
                .setColor("Yellow")
                .setThumbnail(target.displayAvatarURL({ size: 64 }))
                .setAuthor({ name: `⌛ Timeout | ${target.user.tag}` })
                .setDescription(`❌ Le membre ${target} - \`${target.id}\` a été timeout du serveur pendant \`${duration}\` !\n\n**Expiration** : <t:${((Date.now() + msDuration) /
                1000).toFixed(0)}:F>\n\n**Motif** : \`${reason}\``)
                .setTimestamp();
            if (!silent) {
                yield ((_c = interaction.channel) === null || _c === void 0 ? void 0 : _c.send({
                    embeds: [resultEmbed.setFooter({ text: `ID : ${target.id}` })],
                }).then((message) => __awaiter(this, void 0, void 0, function* () { return yield message.react("⌛"); })));
            }
            const guild = yield GuildConfig_1.default.findOne({ guildId: interaction.guildId });
            const log = (_d = guild === null || guild === void 0 ? void 0 : guild.logs) === null || _d === void 0 ? void 0 : _d.moderation;
            if (guild && (log === null || log === void 0 ? void 0 : log.enabled) && (log === null || log === void 0 ? void 0 : log.channelId)) {
                (_f = ((yield ((_e = interaction.guild) === null || _e === void 0 ? void 0 : _e.channels.fetch(log.channelId))))) === null || _f === void 0 ? void 0 : _f.send({
                    embeds: [
                        resultEmbed.setFooter({
                            text: `Timeout effectué par ${interaction.user.tag} - ${interaction.user.id}`,
                            iconURL: interaction.user.displayAvatarURL(),
                        }),
                    ],
                });
            }
            return yield interaction.reply({
                embeds: [new discord_js_1.EmbedBuilder().setColor("Green").setDescription("✅ Timeout effectué avec succès.")],
                ephemeral: true,
            });
        });
    }
}
exports.default = TimeoutAdd;
