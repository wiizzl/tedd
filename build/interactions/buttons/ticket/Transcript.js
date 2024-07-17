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
const discord_html_transcripts_1 = require("discord-html-transcripts");
const discord_js_1 = require("discord.js");
const Interaction_1 = __importDefault(require("../../../base/classes/Interaction"));
const GuildConfig_1 = __importDefault(require("../../../base/schemas/GuildConfig"));
class Transcript extends Interaction_1.default {
    constructor(client) {
        super(client, {
            name: "transcript_ticket",
            permissions: discord_js_1.PermissionFlagsBits.UseApplicationCommands,
            type: discord_js_1.ComponentType.Button,
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const transcript = yield (0, discord_html_transcripts_1.createTranscript)(interaction.channel);
            try {
                interaction.user.send({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor("Green")
                            .setDescription(`Voici le transcript de votre ticket du serveur \`${(_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.name}\`.`),
                    ],
                    files: [transcript],
                });
            }
            catch (error) { }
            const guild = yield GuildConfig_1.default.findOne({ guildId: interaction.guildId });
            const log = (_b = guild === null || guild === void 0 ? void 0 : guild.logs) === null || _b === void 0 ? void 0 : _b.tickets;
            if (guild && (log === null || log === void 0 ? void 0 : log.enabled) && (log === null || log === void 0 ? void 0 : log.channelId)) {
                const channel = interaction.channel;
                (_d = ((yield ((_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.channels.fetch(log.channelId))))) === null || _d === void 0 ? void 0 : _d.send({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor("Purple")
                            .setThumbnail(interaction.user.displayAvatarURL({ size: 64 }))
                            .setAuthor({ name: "📜 Ticket | Transcript" })
                            .setDescription(`Le transcript du ticket de \`${channel.name.split("-")[1]}\` - ${discord_js_1.ChannelSelectMenuInteraction} a été demandé.`)
                            .setFooter({
                            text: `Demande effectuée par ${interaction.user.tag} - ${interaction.user.id}`,
                            iconURL: interaction.user.displayAvatarURL(),
                        })
                            .setTimestamp(),
                    ],
                });
            }
            return yield interaction.reply({
                embeds: [new discord_js_1.EmbedBuilder().setColor("Green").setDescription("✅ Transcript envoyé dans vos messages privés avec succès.")],
                ephemeral: true,
            });
        });
    }
}
exports.default = Transcript;
