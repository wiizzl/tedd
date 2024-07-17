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
class VoiceStateUpdate extends Event_1.default {
    constructor(client) {
        super(client, {
            name: discord_js_1.Events.VoiceStateUpdate,
            description: "Voice state event",
            once: false,
        });
    }
    Execute(oldState, newState) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            const guild = yield GuildConfig_1.default.findOne({ guildId: oldState.guild.id });
            const log = (_a = guild === null || guild === void 0 ? void 0 : guild.logs) === null || _a === void 0 ? void 0 : _a.voices;
            const voice = guild === null || guild === void 0 ? void 0 : guild.voice;
            if (guild && (log === null || log === void 0 ? void 0 : log.enabled) && (log === null || log === void 0 ? void 0 : log.channelId)) {
                const channel = (yield ((_b = oldState.guild) === null || _b === void 0 ? void 0 : _b.channels.fetch(log.channelId)));
                const member = oldState.member;
                try {
                    if (newState.channelId === null) {
                        channel.send({
                            embeds: [
                                new discord_js_1.EmbedBuilder()
                                    .setColor("Red")
                                    .setTitle("Salon vocal quitté")
                                    .setThumbnail(member === null || member === void 0 ? void 0 : member.displayAvatarURL({ size: 64 }))
                                    .setDescription(`> Auteur de l'action : <@${member === null || member === void 0 ? void 0 : member.id}>\n> Nom d'utilisateur : \`${member === null || member === void 0 ? void 0 : member.user.username}\`\n> ID : \`${member === null || member === void 0 ? void 0 : member.id}\`\n> Création du compte : <t:${parseInt(((member === null || member === void 0 ? void 0 : member.user.createdTimestamp) / 1000).toString())}:R>\n\n> Channel : ${oldState.channel}`)
                                    .setTimestamp(),
                            ],
                        });
                    }
                    else {
                        channel.send({
                            embeds: [
                                new discord_js_1.EmbedBuilder()
                                    .setColor("Green")
                                    .setTitle("Salon vocal rejoint")
                                    .setThumbnail(member === null || member === void 0 ? void 0 : member.displayAvatarURL({ size: 64 }))
                                    .setDescription(`> Auteur de l'action : <@${member === null || member === void 0 ? void 0 : member.id}>\n> Nom d'utilisateur : \`${member === null || member === void 0 ? void 0 : member.user.username}\`\n> ID : \`${member === null || member === void 0 ? void 0 : member.id}\`\n> Création du compte : <t:${parseInt(((member === null || member === void 0 ? void 0 : member.user.createdTimestamp) / 1000).toString())}:R>\n\n> Channel : ${newState.channel}`)
                                    .setTimestamp(),
                            ],
                        });
                    }
                }
                catch (error) {
                    console.error(error);
                }
            }
            if (guild && (voice === null || voice === void 0 ? void 0 : voice.channelId)) {
                const member = newState.member;
                if ((log === null || log === void 0 ? void 0 : log.enabled) && (log === null || log === void 0 ? void 0 : log.channelId)) {
                    const channel = (yield ((_c = oldState.guild) === null || _c === void 0 ? void 0 : _c.channels.fetch(log.channelId)));
                    channel.send({
                        embeds: [
                            new discord_js_1.EmbedBuilder()
                                .setColor("Blue")
                                .setTitle("Salon vocal créé")
                                .setThumbnail(member === null || member === void 0 ? void 0 : member.displayAvatarURL({ size: 64 }))
                                .setDescription(`> Auteur de l'action : <@${member === null || member === void 0 ? void 0 : member.id}>\n> Nom d'utilisateur : \`${member === null || member === void 0 ? void 0 : member.user.username}\`\n> ID : \`${member === null || member === void 0 ? void 0 : member.id}\`\n> Création du compte : <t:${parseInt(((member === null || member === void 0 ? void 0 : member.user.createdTimestamp) / 1000).toString())}:R>\n\n> Channel : ${oldState.channel}`)
                                .setTimestamp(),
                        ],
                    });
                }
                try {
                    const createChannel = (yield ((_d = newState.guild) === null || _d === void 0 ? void 0 : _d.channels.fetch(voice.channelId)));
                    if (newState.channelId !== createChannel.id)
                        return;
                    const newChannel = yield ((_e = newState.guild) === null || _e === void 0 ? void 0 : _e.channels.create({
                        name: `Salon de ${member === null || member === void 0 ? void 0 : member.user.displayName}`,
                        type: discord_js_1.ChannelType.GuildVoice,
                        parent: createChannel.parent,
                    }));
                    yield newChannel.setUserLimit(4);
                    yield (member === null || member === void 0 ? void 0 : member.voice.setChannel(newChannel));
                    // if (newChannel.members.size === 0) {
                    //     await newChannel.delete();
                    // }
                    return yield newChannel.send({
                        content: `Propriétaire du salon :${member === null || member === void 0 ? void 0 : member.user}`,
                        embeds: [
                            new discord_js_1.EmbedBuilder()
                                .setAuthor({ name: "Configuration du salon vocal", iconURL: member === null || member === void 0 ? void 0 : member.displayAvatarURL() })
                                .setDescription("Voici l'espace de configuration de votre salon vocal temporaire. Les différentes options disponibles vous permettent de personnaliser les permissions de votre salon selon vos préférences."),
                        ],
                        components: [
                            new discord_js_1.ActionRowBuilder().addComponents([
                                new discord_js_1.StringSelectMenuBuilder()
                                    .setCustomId("voice")
                                    .setPlaceholder("Modifier le statut du salon.")
                                    .addOptions([
                                    {
                                        label: "Ouvert",
                                        value: "open",
                                        description: "Salon ouvert à tous.",
                                        emoji: "🔓",
                                    },
                                    {
                                        label: "Fermé",
                                        value: "closed",
                                        description: "Salon visible mais non accessible.",
                                        emoji: "🔒",
                                    },
                                    {
                                        label: "Privé",
                                        value: "locked",
                                        description: "Salon accessible mais non visible.",
                                        emoji: "🔐",
                                    },
                                ]),
                            ]),
                        ],
                    });
                }
                catch (error) {
                    console.error(error);
                }
            }
        });
    }
}
exports.default = VoiceStateUpdate;
