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
class Voice extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "voice",
            description: "Définir le salon vocal permettant aux utilisateurs de créer le leur.",
            category: Category_1.default.Moderation,
            default_member_permissions: discord_js_1.PermissionFlagsBits.Administrator,
            dm_permission: false,
            cooldown: 3,
            options: [
                {
                    name: "channel",
                    description: "Salon vocal de création.",
                    type: discord_js_1.ApplicationCommandOptionType.Channel,
                    channel_types: [discord_js_1.ChannelType.GuildVoice],
                    required: true,
                },
            ],
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = interaction.options.getChannel("channel");
            yield interaction.deferReply({ ephemeral: true });
            try {
                let guild = yield GuildConfig_1.default.findOne({
                    guildId: interaction.guildId,
                });
                if (!guild) {
                    guild = yield GuildConfig_1.default.create({
                        guildId: interaction.guildId,
                    });
                }
                guild.voice.channelId = channel.id;
                yield guild.save();
                return interaction.editReply({
                    embeds: [new discord_js_1.EmbedBuilder().setColor("Green").setDescription("✅ Le salon vocal a bien été défini.")],
                });
            }
            catch (error) {
                console.error(error);
                return interaction.editReply({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor("Red")
                            .setDescription("❌ Une erreur est survenue en mettant à jour la base de données. Merci de réessayer ultérieurement."),
                    ],
                });
            }
        });
    }
}
exports.default = Voice;
