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
class MessageUpdate extends Event_1.default {
    constructor(client) {
        super(client, {
            name: discord_js_1.Events.MessageUpdate,
            description: "Message update event",
            once: false,
        });
    }
    Execute(oldMessage, newMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            if (oldMessage.author.bot)
                return;
            try {
                const guild = yield GuildConfig_1.default.findOne({ guildId: oldMessage.guildId });
                const log = (_a = guild === null || guild === void 0 ? void 0 : guild.logs) === null || _a === void 0 ? void 0 : _a.messages;
                if (guild && (log === null || log === void 0 ? void 0 : log.enabled) && (log === null || log === void 0 ? void 0 : log.channelId)) {
                    (_c = ((yield ((_b = oldMessage.guild) === null || _b === void 0 ? void 0 : _b.channels.fetch(log.channelId))))) === null || _c === void 0 ? void 0 : _c.send({
                        embeds: [
                            new discord_js_1.EmbedBuilder()
                                .setColor("Orange")
                                .setTitle("Message modifié")
                                .setThumbnail(oldMessage.author.displayAvatarURL({ size: 64 }))
                                .setDescription(`> Auteur du message : <@${oldMessage.author.id}>\n> Nom d'utilisateur : \`${oldMessage.author.username}\`\n> ID : \`${oldMessage.author.id}\`\n> Création du compte : <t:${parseInt((oldMessage.author.createdTimestamp / 1000).toString())}:R>\n\n> Channel : ${oldMessage.url}\n> Ancien message : \`${oldMessage.content}\`\n> Nouveau message : \`${newMessage.content}\``)
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
exports.default = MessageUpdate;
