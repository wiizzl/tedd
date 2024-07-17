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
const voice_1 = require("@discordjs/voice");
const discord_js_1 = require("discord.js");
const Command_1 = __importDefault(require("../../base/classes/Command"));
const Category_1 = __importDefault(require("../../base/enums/Category"));
class TextToSpeech extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "tts",
            description: "Fait dire la phrase de votre choix par le robot dans un salon vocal.",
            category: Category_1.default.Audio,
            default_member_permissions: discord_js_1.PermissionFlagsBits.SendVoiceMessages,
            cooldown: 20,
            dm_permission: false,
            options: [
                {
                    name: "phrase",
                    description: "Phrase que le robot doit dire.",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const phrase = interaction.options.getString("phrase");
            const member = interaction.member;
            const voiceChannelMember = member.voice.channel;
            const voiceChannelBot = (yield interaction.guild.members.fetchMe()).voice.channel;
            const errorEmbed = new discord_js_1.EmbedBuilder().setColor("Red");
            if (!voiceChannelMember) {
                return yield interaction.reply({
                    embeds: [errorEmbed.setDescription("❌ Vous n'êtes pas dans un salon vocal.")],
                    ephemeral: true,
                });
            }
            if (voiceChannelBot && voiceChannelBot.id !== voiceChannelMember.id) {
                return yield interaction.reply({
                    embeds: [
                        errorEmbed.setDescription(`❌ Je suis déjà dans un salon vocal, réessayez plus tard ou rejoignez moi dans le salon : ${voiceChannelMember}`),
                    ],
                    ephemeral: true,
                });
            }
            if (phrase.length > 256) {
                return yield interaction.reply({
                    embeds: [errorEmbed.setDescription("❌ Votre phrase ne doit pas dépasser 256 caractères.")],
                    ephemeral: true,
                });
            }
            try {
                this.textToSpeech(voiceChannelMember, interaction.guild, phrase, "fr");
                return yield interaction.reply({
                    embeds: [new discord_js_1.EmbedBuilder().setColor("Green").setDescription(`✅ Je me connecte a votre salon vocal pour vous dire : \`${phrase}\``)],
                    ephemeral: true,
                });
            }
            catch (error) {
                console.error(error);
                return yield interaction.reply({
                    embeds: [errorEmbed.setDescription("❌ Erreur lors de la lecture de la phrase, essayez-en une autre !")],
                    ephemeral: true,
                });
            }
        });
    }
    textToSpeech(channel, guild, phrase, language) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = `http://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encodeURIComponent(phrase)}&tl=${language}`;
                const resource = (0, voice_1.createAudioResource)(url, {
                    inlineVolume: true,
                });
                const connection = (0, voice_1.joinVoiceChannel)({
                    channelId: channel.id,
                    guildId: guild.id,
                    adapterCreator: guild.voiceAdapterCreator,
                });
                const player = (0, voice_1.createAudioPlayer)({
                    behaviors: {
                        noSubscriber: voice_1.NoSubscriberBehavior.Pause,
                    },
                });
                player.play(resource);
                connection.subscribe(player);
                player.on(voice_1.AudioPlayerStatus.Idle, () => {
                    connection.destroy();
                });
            }
            catch (error) {
                console.error(error);
            }
        });
    }
}
exports.default = TextToSpeech;
