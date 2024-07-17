"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = __importDefault(require("../../base/classes/Command"));
const Category_1 = __importDefault(require("../../base/enums/Category"));
class Logs extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "logs",
            description: "Configurer les logs du robot.",
            category: Category_1.default.Logs,
            default_member_permissions: discord_js_1.PermissionsBitField.Flags.Administrator,
            dm_permission: false,
            cooldown: 3,
            options: [
                {
                    name: "toggle",
                    type: discord_js_1.ApplicationCommandOptionType.Subcommand,
                    description: "Activer ou désactiver un type de log.",
                    options: [
                        {
                            name: "type",
                            description: "Type de log à activer ou désactiver.",
                            type: discord_js_1.ApplicationCommandOptionType.String,
                            required: true,
                            choices: [
                                {
                                    name: "Modération",
                                    value: "moderation",
                                },
                                {
                                    name: "Messages",
                                    value: "messages",
                                },
                                {
                                    name: "Vocaux",
                                    value: "voices",
                                },
                                {
                                    name: "Tickets",
                                    value: "tickets",
                                },
                            ],
                        },
                        {
                            name: "toggle",
                            description: "Activer ou désactiver ce type de logs.",
                            type: discord_js_1.ApplicationCommandOptionType.Boolean,
                            required: true,
                        },
                    ],
                },
                {
                    name: "set",
                    type: discord_js_1.ApplicationCommandOptionType.Subcommand,
                    description: "Définir le salon d'un type de log.",
                    options: [
                        {
                            name: "type",
                            description: "Type de log où modifier le salon.",
                            type: discord_js_1.ApplicationCommandOptionType.String,
                            required: true,
                            choices: [
                                {
                                    name: "Modération",
                                    value: "moderation",
                                },
                                {
                                    name: "Messages",
                                    value: "messages",
                                },
                                {
                                    name: "Vocaux",
                                    value: "voices",
                                },
                                {
                                    name: "Tickets",
                                    value: "tickets",
                                },
                            ],
                        },
                        {
                            name: "channel",
                            description: "Salon pour ce type de logs.",
                            type: discord_js_1.ApplicationCommandOptionType.Channel,
                            required: true,
                            channel_types: [discord_js_1.ChannelType.GuildText],
                        },
                    ],
                },
            ],
        });
    }
}
exports.default = Logs;
