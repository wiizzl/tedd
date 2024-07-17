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
class InteractionHandler extends Event_1.default {
    constructor(client) {
        super(client, {
            name: discord_js_1.Events.InteractionCreate,
            description: "Interaction handler event",
            once: false,
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (interaction.isButton() || interaction.isStringSelectMenu()) {
                const file = this.client.interactions.find((i) => i.name === interaction.customId && i.type === interaction.componentType);
                if (!file) {
                    this.client.interactions.delete(interaction.customId);
                    return yield interaction.reply({
                        embeds: [new discord_js_1.EmbedBuilder().setColor("Red").setDescription("❌ Cette intéraction n'a pas d'action associée.")],
                        ephemeral: true,
                    });
                }
                if (file.permissions &&
                    ((_a = interaction.member) === null || _a === void 0 ? void 0 : _a.permissions) instanceof discord_js_1.PermissionsBitField &&
                    !((_b = interaction.member) === null || _b === void 0 ? void 0 : _b.permissions.has(new discord_js_1.PermissionsBitField(file.permissions)))) {
                    return yield interaction.reply({
                        embeds: [new discord_js_1.EmbedBuilder().setColor("Red").setDescription("❌ Vous n'avez pas la permission d'utiliser cette intéraction.")],
                        ephemeral: true,
                    });
                }
                try {
                    return file.Execute(interaction);
                }
                catch (error) {
                    console.error(error);
                }
            }
        });
    }
}
exports.default = InteractionHandler;
