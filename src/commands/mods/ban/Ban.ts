import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";

import Command from "../../../base/classes/Command";
import CustomClient from "../../../base/classes/CustomClient";

import Category from "../../../base/enums/Category";

export default class Ban extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "ban",
            description: "Bannir / Débannir un utilisateur.",
            category: Category.Moderation,
            default_member_permissions: PermissionFlagsBits.BanMembers,
            dm_permission: false,
            cooldown: 3,
            options: [
                {
                    name: "add",
                    description: "Bannir un utilisateur.",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "target",
                            description: "Utilisateur à bannir.",
                            type: ApplicationCommandOptionType.User,
                            required: true,
                        },
                        {
                            name: "reason",
                            description: "Motif du banissement.",
                            type: ApplicationCommandOptionType.String,
                            required: false,
                        },
                        {
                            name: "days",
                            description: "Supprimer les messages récents de l'utilisateur.",
                            type: ApplicationCommandOptionType.Integer,
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
                            type: ApplicationCommandOptionType.Boolean,
                            required: false,
                        },
                    ],
                },
                {
                    name: "remove",
                    description: "Débannir un utilisateur.",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "target",
                            description: "ID de l'utilisateur à débannir.",
                            type: ApplicationCommandOptionType.String,
                            required: true,
                        },
                        {
                            name: "reason",
                            description: "Motif du débanissement.",
                            type: ApplicationCommandOptionType.String,
                            required: false,
                        },
                    ],
                },
            ],
        });
    }
}
