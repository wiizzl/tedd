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
const GuildConfig_1 = __importDefault(require("../../base/schemas/GuildConfig"));
class Slowmode extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "slowmode",
            description: "Définir le mode lent d'un salon.",
            category: Category_1.default.Moderation,
            default_member_permissions: discord_js_1.PermissionFlagsBits.ManageChannels,
            dm_permission: false,
            cooldown: 5,
            options: [
                {
                    name: "rate",
                    description: "Taux de lenteur en secondes.",
                    type: discord_js_1.ApplicationCommandOptionType.Integer,
                    required: true,
                    choices: [
                        { name: "Aucun", value: "0" },
                        { name: "5 secondes", value: "5" },
                        { name: "10 secondes", value: "10" },
                        { name: "15 secondes", value: "15" },
                        { name: "30 secondes", value: "30" },
                        { name: "1 minute", value: "60" },
                        { name: "2 minutes", value: "120" },
                        { name: "5 minutes", value: "300" },
                        { name: "10 minutes", value: "600" },
                        { name: "15 minutes", value: "900" },
                        { name: "30 minutes", value: "1800" },
                        { name: "1 heure", value: "3600" },
                        { name: "2 heure", value: "7200" },
                        { name: "6 heure", value: "21600" },
                    ],
                },
                {
                    name: "channel",
                    description: "Le salon dans lequel le mode lent sera appliqué (par défaut, le salon actuel).",
                    type: discord_js_1.ApplicationCommandOptionType.Channel,
                    required: false,
                    channel_types: [discord_js_1.ChannelType.GuildText],
                },
                {
                    name: "reason",
                    description: "Motif du mode lent.",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: false,
                },
            ],
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const rate = interaction.options.getInteger("rate");
            const channel = (interaction.options.getChannel("channel") || interaction.channel);
            const reason = interaction.options.getString("reason") || "Aucun motif donné.";
            const errorEmbed = new discord_js_1.EmbedBuilder().setColor("Red");
            if (rate < 0 || rate > 26000) {
                return yield interaction.reply({
                    embeds: [errorEmbed.setDescription("❌ Le taux de lenteur doit être compris entre 0 et 6 heures.")],
                    ephemeral: true,
                });
            }
            try {
                channel.setRateLimitPerUser(rate, reason);
            }
            catch (error) {
                console.error(error);
                return yield interaction.reply({
                    embeds: [errorEmbed.setDescription("❌ Erreur lors de la modification du mode lent.")],
                    ephemeral: true,
                });
            }
            const guild = yield GuildConfig_1.default.findOne({ guildId: interaction.guildId });
            const log = (_a = guild === null || guild === void 0 ? void 0 : guild.logs) === null || _a === void 0 ? void 0 : _a.moderation;
            if (guild && (log === null || log === void 0 ? void 0 : log.enabled) && (log === null || log === void 0 ? void 0 : log.channelId)) {
                (_c = ((yield ((_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.channels.fetch(log.channelId))))) === null || _c === void 0 ? void 0 : _c.send({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor("Blue")
                            .setAuthor({ name: "⌚ Mode lent" })
                            .setDescription(`Le mode lent du salon ${channel} a été modifié à \`${rate}\` secondes.`)
                            .setTimestamp()
                            .setFooter({
                            text: `Mode lent modifié par ${interaction.user.tag} - ${interaction.user.id}`,
                            iconURL: interaction.user.displayAvatarURL(),
                        }),
                    ],
                });
            }
            return yield interaction.reply({
                embeds: [
                    new discord_js_1.EmbedBuilder().setColor("Green").setDescription(`✅ Taux du mode lent modifié à \`${rate}\` secondes pour le salon ${channel}`),
                ],
                ephemeral: true,
            });
        });
    }
}
exports.default = Slowmode;
