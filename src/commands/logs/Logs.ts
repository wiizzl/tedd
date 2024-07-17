import { ApplicationCommandOptionType, ChannelType, PermissionsBitField } from "discord.js";

import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";

import Category from "../../base/enums/Category";

export default class Logs extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "logs",
            description: "Configurer les logs du robot.",
            category: Category.Logs,
            default_member_permissions: PermissionsBitField.Flags.Administrator,
            dm_permission: false,
            cooldown: 3,
            options: [
                {
                    name: "toggle",
                    type: ApplicationCommandOptionType.Subcommand,
                    description: "Activer ou désactiver un type de log.",
                    options: [
                        {
                            name: "type",
                            description: "Type de log à activer ou désactiver.",
                            type: ApplicationCommandOptionType.String,
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
                            type: ApplicationCommandOptionType.Boolean,
                            required: true,
                        },
                    ],
                },
                {
                    name: "set",
                    type: ApplicationCommandOptionType.Subcommand,
                    description: "Définir le salon d'un type de log.",
                    options: [
                        {
                            name: "type",
                            description: "Type de log où modifier le salon.",
                            type: ApplicationCommandOptionType.String,
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
                            type: ApplicationCommandOptionType.Channel,
                            required: true,
                            channel_types: [ChannelType.GuildText],
                        },
                    ],
                },
            ],
        });
    }
}
