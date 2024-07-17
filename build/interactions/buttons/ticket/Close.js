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
const discord_html_transcripts_1 = require("discord-html-transcripts");
const Interaction_1 = __importDefault(require("../../../base/classes/Interaction"));
const GuildConfig_1 = __importDefault(require("../../../base/schemas/GuildConfig"));
class Close extends Interaction_1.default {
    constructor(client) {
        super(client, {
            name: "close_ticket",
            permissions: discord_js_1.PermissionFlagsBits.UseApplicationCommands,
            type: discord_js_1.ComponentType.Button,
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const transcript = yield (0, discord_html_transcripts_1.createTranscript)(interaction.channel);
            const guild = yield GuildConfig_1.default.findOne({ guildId: interaction.guildId });
            const log = (_a = guild === null || guild === void 0 ? void 0 : guild.logs) === null || _a === void 0 ? void 0 : _a.tickets;
            if (guild && (log === null || log === void 0 ? void 0 : log.enabled) && (log === null || log === void 0 ? void 0 : log.channelId)) {
                const channel = interaction.channel;
                (_c = ((yield ((_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.channels.fetch(log.channelId))))) === null || _c === void 0 ? void 0 : _c.send({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor("Purple")
                            .setThumbnail(interaction.user.displayAvatarURL({ size: 64 }))
                            .setAuthor({ name: "📜 Ticket | Fermeture" })
                            .setDescription(`Le ticket de \`${channel.name.split("-")[1]}\` a été fermé.`)
                            .setFooter({
                            text: `Fermeture effectuée par ${interaction.user.tag} - ${interaction.user.id}`,
                            iconURL: interaction.user.displayAvatarURL(),
                        })
                            .setTimestamp(),
                    ],
                    files: [transcript],
                });
            }
            return yield ((_d = interaction.channel) === null || _d === void 0 ? void 0 : _d.delete());
        });
    }
}
exports.default = Close;
