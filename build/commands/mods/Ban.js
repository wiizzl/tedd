"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = __importDefault(require("../../base/classes/Command"));
const Category_1 = __importDefault(require("../../base/enums/Category"));
class Ban extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "ban",
            description: "Bannir / Débannir un utilisateur.",
            category: Category_1.default.Moderation,
            default_member_permissions: discord_js_1.PermissionFlagsBits.BanMembers,
            dm_permission: false,
            cooldown: 3,
            options: [
                {
                    name: "add",
                    description: "Bannir un utilisateur.",
                    type: discord_js_1.ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "target",
                            description: "Utilisateur à bannir.",
                            type: discord_js_1.ApplicationCommandOptionType.User,
                            required: true,
                        },
                        {
                            name: "reason",
                            description: "Motif du banissement.",
                            type: discord_js_1.ApplicationCommandOptionType.String,
                            required: false,
                        },
                        {
                            name: "days",
                            description: "Supprimer les messages récents de l'utilisateur.",
                            type: discord_js_1.ApplicationCommandOptionType.Integer,
                            required: false,
                            choices: [
                                {
                                    name: "Aucun",
                                    value: 0,
                                },
                                { name: "1 jour", value: 86400 },
                                { name: "7 jour", value: 604800 },
                            ],
                        },
                        {
                            name: "silent",
                            description: "Ne pas envoyer un message dans le salon.",
                            type: discord_js_1.ApplicationCommandOptionType.Boolean,
                            required: false,
                        },
                    ],
                },
                {
                    name: "remove",
                    description: "Débannir un utilisateur.",
                    type: discord_js_1.ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "target",
                            description: "ID de l'utilisateur à débannir.",
                            type: discord_js_1.ApplicationCommandOptionType.String,
                            required: true,
                        },
                        {
                            name: "reason",
                            description: "Motif du débanissement.",
                            type: discord_js_1.ApplicationCommandOptionType.String,
                            required: false,
                        },
                    ],
                },
            ],
        });
    }
}
exports.default = Ban;
