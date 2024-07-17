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
class Emit extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "emit",
            description: "Déclencher un évènement.",
            category: Category_1.default.Development,
            default_member_permissions: discord_js_1.PermissionFlagsBits.Administrator,
            dm_permission: false,
            cooldown: 1,
            options: [
                {
                    name: "event",
                    description: "Nom de l'évènement à déclencher.",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        {
                            name: "GuildCreate",
                            value: discord_js_1.Events.GuildCreate,
                        },
                        {
                            name: "GuildDelete",
                            value: discord_js_1.Events.GuildDelete,
                        },
                    ],
                },
            ],
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = interaction.options.getString("event");
            if (event == discord_js_1.Events.GuildCreate || event == discord_js_1.Events.GuildDelete) {
                this.client.emit(event, interaction.guild);
            }
            interaction.reply({
                embeds: [new discord_js_1.EmbedBuilder().setColor("Green").setDescription(`✅ Évènement \`${event}\` déclenché avec succès.`)],
                ephemeral: true,
            });
        });
    }
}
exports.default = Emit;
