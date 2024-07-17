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
const Event_1 = __importDefault(require("../../base/classes/Event"));
const GuildConfig_1 = __importDefault(require("../../base/schemas/GuildConfig"));
class MessageDelete extends Event_1.default {
    constructor(client) {
        super(client, {
            name: discord_js_1.Events.MessageDelete,
            description: "Message delete event",
            once: false,
        });
    }
    Execute(message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            if (message.author.bot)
                return;
            try {
                const guild = yield GuildConfig_1.default.findOne({ guildId: message.guildId });
                const log = (_a = guild === null || guild === void 0 ? void 0 : guild.logs) === null || _a === void 0 ? void 0 : _a.messages;
                const auditLogs = yield ((_b = message.guild) === null || _b === void 0 ? void 0 : _b.fetchAuditLogs({ type: discord_js_1.AuditLogEvent.MessageDelete }));
                const author = auditLogs === null || auditLogs === void 0 ? void 0 : auditLogs.entries.first();
                if (guild && (log === null || log === void 0 ? void 0 : log.enabled) && (log === null || log === void 0 ? void 0 : log.channelId)) {
                    (_d = ((yield ((_c = message.guild) === null || _c === void 0 ? void 0 : _c.channels.fetch(log.channelId))))) === null || _d === void 0 ? void 0 : _d.send({
                        embeds: [
                            new discord_js_1.EmbedBuilder()
                                .setColor("Red")
                                .setTitle("Message supprimé")
                                .setThumbnail(message.author.displayAvatarURL({ size: 64 }))
                                .setDescription(`> Auteur du message : <@${message.author.id}>\n> Nom d'utilisateur : \`${message.author.username}\`\n> ID : \`${message.author.id}\`\n> Création du compte : <t:${parseInt((message.author.createdTimestamp / 1000).toString())}:R>\n\n> Channel : ${message.channel}\n> Message : \`${message.content}\`\n\n> Auteur de la suppression : <@${(_e = author === null || author === void 0 ? void 0 : author.executor) === null || _e === void 0 ? void 0 : _e.id}>\n> Nom d'utilisateur : \`${(_f = author === null || author === void 0 ? void 0 : author.executor) === null || _f === void 0 ? void 0 : _f.username}\`\n> ID : \`${(_g = author === null || author === void 0 ? void 0 : author.executor) === null || _g === void 0 ? void 0 : _g.id}\`\n> Création du compte : <t:${parseInt((((_h = author === null || author === void 0 ? void 0 : author.executor) === null || _h === void 0 ? void 0 : _h.createdTimestamp) / 1000).toString())}:R>`)
                                .setTimestamp(),
                        ],
                    });
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
}
exports.default = MessageDelete;
