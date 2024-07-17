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
class Clear extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "clear",
            description: "Supprime des messages d'un utilisateur ou d'un salon.",
            category: Category_1.default.Moderation,
            cooldown: 5,
            dm_permission: false,
            default_member_permissions: discord_js_1.PermissionFlagsBits.ManageMessages,
            options: [
                {
                    name: "amount",
                    description: "Le nombre de messages à supprimer.",
                    type: discord_js_1.ApplicationCommandOptionType.Integer,
                    required: true,
                },
                {
                    name: "channel",
                    description: "Le salon où les messages seront supprimés (par défaut, le salon actuel).",
                    type: discord_js_1.ApplicationCommandOptionType.Channel,
                    required: false,
                    channel_types: [discord_js_1.ChannelType.GuildText],
                },
                {
                    name: "target",
                    description: "L'utilisateur dont les messages seront supprimés (par défaut, tous les utilisateurs).",
                    type: discord_js_1.ApplicationCommandOptionType.User,
                    required: false,
                },
            ],
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            let amount = interaction.options.getInteger("amount");
            const channel = (interaction.options.getChannel("channel") || interaction.channel);
            const target = interaction.options.getMember("target");
            const errorEmbed = new discord_js_1.EmbedBuilder().setColor("Red");
            if (amount < 1 || amount > 100) {
                return yield interaction.reply({
                    embeds: [errorEmbed.setDescription("❌ Le nombre de messages à supprimer doit être compris entre 1 et 100.")],
                    ephemeral: true,
                });
            }
            const messages = yield channel.messages.fetch({ limit: 100 });
            var filterMessages = target ? messages.filter((m) => m.author.id === target.id) : messages;
            try {
                yield channel.bulkDelete(Array.from(filterMessages.keys()).slice(0, amount), true);
            }
            catch (error) {
                return yield interaction.reply({
                    embeds: [errorEmbed.setDescription("❌ Impossible de supprimer les messages.")],
                    ephemeral: true,
                });
            }
            const guild = yield GuildConfig_1.default.findOne({ guildId: interaction.guildId });
            const log = (_a = guild === null || guild === void 0 ? void 0 : guild.logs) === null || _a === void 0 ? void 0 : _a.moderation;
            if (guild && (log === null || log === void 0 ? void 0 : log.enabled) && (log === null || log === void 0 ? void 0 : log.channelId)) {
                (_c = ((yield ((_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.channels.fetch(log.channelId))))) === null || _c === void 0 ? void 0 : _c.send({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor("Orange")
                            .setAuthor({ name: `🧹 Clear de messages${target ? ` | ${target.user.tag}` : ""}` })
                            .setDescription(`Suppression de \`${amount}\` messages${target ? ` de ${target}` : ""} dans ${channel}`)
                            .setTimestamp()
                            .setFooter({
                            text: `Clear effectué par ${interaction.user.tag} - ${interaction.user.id}`,
                            iconURL: interaction.user.displayAvatarURL(),
                        }),
                    ],
                });
            }
            return yield interaction.reply({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setColor("Green")
                        .setDescription(`✅ Suppression de \`${amount}\` messages${target ? ` (de ${target})` : ""} dans le salon ${channel} effectuée avec succès.`),
                ],
                ephemeral: true,
            });
        });
    }
}
exports.default = Clear;
