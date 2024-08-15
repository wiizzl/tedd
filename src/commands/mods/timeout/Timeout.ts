import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";

import Command from "../../../base/classes/Command";
import CustomClient from "../../../base/classes/CustomClient";

import Category from "../../../base/enums/Category";

export default class Timeout extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "timeout",
            description: "Ajouter / supprimer un timeout d'un utilisateur.",
            category: Category.Moderation,
            default_member_permissions: PermissionFlagsBits.MuteMembers,
            cooldown: 3,
            dm_permission: false,
            options: [
                {
                    name: "add",
                    description: "Ajouter un timeout à un utilisateur.",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "target",
                            description: "Utilisateur à timeout",
                            type: ApplicationCommandOptionType.User,
                            required: true,
                        },
                        {
                            name: "duration",
                            description: "Durée du timeout.",
                            type: ApplicationCommandOptionType.String,
                            required: false,
                            choices: [
                                { name: "5 minutes", value: "5m" },
                                { name: "10 minutes", value: "10m" },
                                { name: "15 minutes", value: "15m" },
                                { name: "30 minutes", value: "30m" },
                                { name: "45 minutes", value: "45m" },
                                { name: "1 heure", value: "1h" },
                                { name: "2 heures", value: "2h" },
                                { name: "6 heures", value: "6h" },
                                { name: "12 heures", value: "12h" },
                                { name: "1 jour", value: "1d" },
                                { name: "3 jour", value: "3d" },
                                { name: "5 jour", value: "5d" },
                                { name: "1 semaine", value: "1w" },
                                { name: "2 semaine", value: "2w" },
                                { name: "3 semaine", value: "3w" },
                                { name: "4 semaine", value: "4w" },
                            ],
                        },
                        {
                            name: "reason",
                            description: "Motif du timeout.",
                            type: ApplicationCommandOptionType.String,
                            required: false,
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
                    description: "Supprimer un timeout d'un utilisateur.",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "target",
                            description: "Utilisateur à qui supprimer le timeout.",
                            type: ApplicationCommandOptionType.User,
                            required: true,
                        },
                        {
                            name: "reason",
                            description: "Motif de la suppression du timeout.",
                            type: ApplicationCommandOptionType.String,
                            required: false,
                        },
                    ],
                },
            ],
        });
    }
}
