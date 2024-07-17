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
            name: "voice",
            permissions: discord_js_1.PermissionFlagsBits.UseApplicationCommands,
            type: discord_js_1.ComponentType.StringSelect,
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            if (interaction.message.content.split("@")[1].split(">")[0] !== interaction.user.id) {
                return yield interaction.reply({
                    embeds: [new discord_js_1.EmbedBuilder().setColor("Red").setDescription("❌ Vous n'êtes pas le propriétaire du salon.")],
                    ephemeral: true,
                });
            }
            const interactionChannel = interaction.channel;
            yield interaction.message.edit({
                embeds: [interaction.message.embeds[0]],
            });
            try {
                switch (interaction.values[0]) {
                    case "open":
                        yield interactionChannel.permissionOverwrites.create((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id, {
                            ViewChannel: true,
                            Connect: true,
                        });
                        break;
                    case "closed":
                        yield interactionChannel.permissionOverwrites.create((_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.id, {
                            ViewChannel: true,
                            Connect: false,
                        });
                        break;
                    case "locked":
                        yield interactionChannel.permissionOverwrites.create((_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.id, {
                            ViewChannel: false,
                            Connect: true,
                        });
                        break;
                    default:
                        throw new Error("Invalid string menu value");
                }
                return yield interaction.reply({
                    embeds: [new discord_js_1.EmbedBuilder().setColor("Green").setDescription("✅ Action effectuée avec succès.")],
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
