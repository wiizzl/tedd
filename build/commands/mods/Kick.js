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
class Kick extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "kick",
            description: "Expulser un utilisateur.",
            category: Category_1.default.Moderation,
            default_member_permissions: discord_js_1.PermissionFlagsBits.KickMembers,
            dm_permission: false,
            cooldown: 3,
            options: [
                {
                    name: "target",
                    description: "Utilisateur à expulser.",
                    type: discord_js_1.ApplicationCommandOptionType.User,
                    required: true,
                },
                {
                    name: "reason",
                    description: "Motif de l'expulsion.",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: false,
                },
                {
                    name: "silent",
                    description: "Ne pas envoyer un message dans le salon.",
                    type: discord_js_1.ApplicationCommandOptionType.Boolean,
                    required: false,
                },
            ],
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            const target = interaction.options.getMember("target");
            const reason = interaction.options.getString("reason") || "Aucun motif donné.";
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
                    embeds: [errorEmbed.setDescription("❌ Vous ne pouvez pas vous expulser vous-même.")],
                    ephemeral: true,
                });
            }
            if (target.roles.highest.position >= ((_a = interaction.member) === null || _a === void 0 ? void 0 : _a.roles).highest.position) {
                return yield interaction.reply({
                    embeds: [
                        errorEmbed.setDescription("❌ Vous ne pouvez pas expulser un utilisateur avec un rôle égal ou supérieur à votre rôle actuel."),
                    ],
                    ephemeral: true,
                });
            }
            if (!target.kickable) {
                return yield interaction.reply({
                    embeds: [errorEmbed.setDescription("❌ Cet utilisateur ne peut pas être expulsé.")],
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
                            .setColor("Orange")
                            .setDescription(`👟 Vous avez été **expulsé** du serveur \`${(_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.name}\` par ${interaction.member}.\n\nSi vous pensez que c'est une erreur, vous pouvez toujours rejoindre le serveur via une invitation valide.\n\n**Motif** : \`${reason}\``),
                    ],
                });
                yield target.kick(reason);
            }
            catch (error) { }
            const resultEmbed = new discord_js_1.EmbedBuilder()
                .setColor("Orange")
                .setThumbnail(target.displayAvatarURL({ size: 64 }))
                .setAuthor({ name: `👟 Expulsion | ${target.user.tag}` })
                .setDescription(`❌ Le membre ${target} - \`${target.id}\` a été expulsé du serveur !\n\n**Motif** : \`${reason}\``)
                .setTimestamp();
            if (!silent) {
                yield ((_c = interaction.channel) === null || _c === void 0 ? void 0 : _c.send({
                    embeds: [resultEmbed.setFooter({ text: `ID : ${target.id}` })],
                }).then((message) => __awaiter(this, void 0, void 0, function* () { return yield message.react("👟"); })));
            }
            const guild = yield GuildConfig_1.default.findOne({ guildId: interaction.guildId });
            const log = (_d = guild === null || guild === void 0 ? void 0 : guild.logs) === null || _d === void 0 ? void 0 : _d.moderation;
            if (guild && (log === null || log === void 0 ? void 0 : log.enabled) && (log === null || log === void 0 ? void 0 : log.channelId)) {
                (_f = ((yield ((_e = interaction.guild) === null || _e === void 0 ? void 0 : _e.channels.fetch(log.channelId))))) === null || _f === void 0 ? void 0 : _f.send({
                    embeds: [
                        resultEmbed.setFooter({
                            text: `Expulsion effectuée par ${interaction.user.tag} - ${interaction.user.id}`,
                            iconURL: interaction.user.displayAvatarURL(),
                        }),
                    ],
                });
            }
            return yield interaction.reply({
                embeds: [new discord_js_1.EmbedBuilder().setColor("Green").setDescription("✅ Expulsion effectuée avec succès.")],
                ephemeral: true,
            });
        });
    }
}
exports.default = Kick;
