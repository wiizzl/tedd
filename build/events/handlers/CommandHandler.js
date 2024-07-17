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
class CommandHandler extends Event_1.default {
    constructor(client) {
        super(client, {
            name: discord_js_1.Events.InteractionCreate,
            description: "Command handler event",
            once: false,
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            if (!interaction.isChatInputCommand())
                return;
            const command = this.client.commands.get(interaction.commandName);
            if (!command) {
                this.client.commands.delete(interaction.commandName);
                return yield interaction.reply({
                    embeds: [new discord_js_1.EmbedBuilder().setColor("Red").setDescription("❌ Cette commande n'a pas d'action associée.")],
                    ephemeral: true,
                });
            }
            const { cooldowns } = this.client;
            if (!cooldowns.has(command.name)) {
                cooldowns.set(command.name, new discord_js_1.Collection());
            }
            const now = Date.now();
            const timestamps = cooldowns.get(command.name);
            const cooldownAmount = (command.cooldown || 3) * 1000;
            const cooldown = timestamps.get(interaction.user.id) || 0;
            const isAdmin = typeof ((_a = interaction.member) === null || _a === void 0 ? void 0 : _a.permissions) === "string"
                ? (_b = interaction.member) === null || _b === void 0 ? void 0 : _b.permissions.includes("Administrator")
                : (_c = interaction.member) === null || _c === void 0 ? void 0 : _c.permissions.has("Administrator");
            if (timestamps.has(interaction.user.id) && cooldown && now < cooldown + cooldownAmount && !isAdmin) {
                return yield interaction.reply({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor("Red")
                            .setDescription(`❌ Merci d'attendre \`${((cooldown + cooldownAmount - now) / 1000).toFixed(0)} secondes\` avant de ré-exécuter la commande.`),
                    ],
                    ephemeral: true,
                });
            }
            timestamps.set(interaction.user.id, now);
            setTimeout(() => {
                timestamps.delete(interaction.user.id);
            }, cooldownAmount);
            try {
                const subCommandGroup = interaction.options.getSubcommandGroup(false);
                const subCommand = `${interaction.commandName}${subCommandGroup ? `.${subCommandGroup}` : ""}.${interaction.options.getSubcommand(false) || ""}`;
                return ((_d = this.client.subCommands.get(subCommand)) === null || _d === void 0 ? void 0 : _d.Execute(interaction)) || command.Execute(interaction);
            }
            catch (error) {
                console.error(error);
            }
        });
    }
}
exports.default = CommandHandler;
