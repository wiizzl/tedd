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
const Interaction_1 = __importDefault(require("../../base/classes/Interaction"));
class Ticket extends Interaction_1.default {
    constructor(client) {
        super(client, {
            name: "ticket",
            permissions: discord_js_1.PermissionFlagsBits.UseApplicationCommands,
            type: discord_js_1.ComponentType.StringSelect,
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const interactionChannel = interaction.channel;
            yield interaction.message.edit({
                embeds: [interaction.message.embeds[0]],
            });
            try {
                const channel = yield ((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.channels.create({
                    name: `ticket-${interaction.user.username}`,
                    type: discord_js_1.ChannelType.GuildText,
                    parent: interactionChannel.parent,
                }));
                yield (channel === null || channel === void 0 ? void 0 : channel.permissionOverwrites.create((_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.id, { ViewChannel: false }));
                yield (channel === null || channel === void 0 ? void 0 : channel.permissionOverwrites.create(interaction.user.id, {
                    ViewChannel: true,
                    SendMessages: true,
                    ReadMessageHistory: true,
                    AttachFiles: true,
                    EmbedLinks: true,
                }));
                yield (channel === null || channel === void 0 ? void 0 : channel.permissionOverwrites.create(interaction.client.user.id, {
                    ViewChannel: true,
                    SendMessages: true,
                    ReadMessageHistory: true,
                    AttachFiles: true,
                    EmbedLinks: true,
                }));
                yield (channel === null || channel === void 0 ? void 0 : channel.setTopic(interaction.user.id));
                yield (channel === null || channel === void 0 ? void 0 : channel.send({
                    content: interaction.user.toString(),
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setTitle(`${interaction.user.displayName} vient de créer un ticket.`)
                            .setDescription(`Catégorie : \`${interaction.values[0]}\`\n\n**Merci de décrire votre demande dans ce salon.**`)
                            .setTimestamp(),
                    ],
                    components: [
                        new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setLabel("Fermer le ticket").setEmoji("🗑️").setStyle(discord_js_1.ButtonStyle.Danger).setCustomId("close_ticket"), new discord_js_1.ButtonBuilder()
                            .setLabel("Récupérer le transcript")
                            .setEmoji("📜")
                            .setStyle(discord_js_1.ButtonStyle.Primary)
                            .setCustomId("transcript_ticket")),
                    ],
                }));
                return yield interaction.reply({
                    embeds: [new discord_js_1.EmbedBuilder().setColor("Green").setDescription(`✅ Votre ticket a été créé avec succès : ${channel}`)],
                    ephemeral: true,
                });
            }
            catch (error) {
                console.error(error);
                return yield interaction.reply({
                    embeds: [new discord_js_1.EmbedBuilder().setColor("Red").setDescription("❌ Une erreur est survenue lors de la création du ticket.")],
                    ephemeral: true,
                });
            }
        });
    }
}
exports.default = Ticket;
