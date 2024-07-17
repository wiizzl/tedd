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
class Ping extends Interaction_1.default {
    constructor(client) {
        super(client, {
            name: "ping",
            permissions: discord_js_1.PermissionFlagsBits.UseApplicationCommands,
            type: discord_js_1.ComponentType.Button,
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.deferUpdate();
            const ping = this.client.ws.ping;
            let color;
            if (ping < 50) {
                color = "Green";
            }
            else if (ping < 100) {
                color = "Orange";
            }
            else {
                color = "Red";
            }
            return yield interaction.editReply({
                embeds: [interaction.message.embeds[0]],
            });
        });
    }
}
exports.default = Ping;
