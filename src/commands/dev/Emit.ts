import { ApplicationCommandOptionType, ChatInputCommandInteraction, EmbedBuilder, Events, Guild, PermissionFlagsBits } from "discord.js";

import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";

import Category from "../../base/enums/Category";

export default class Emit extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "emit",
            description: "Déclencher un évènement.",
            category: Category.Development,
            default_member_permissions: PermissionFlagsBits.Administrator,
            dm_permission: false,
            cooldown: 1,
            options: [
                {
                    name: "event",
                    description: "Nom de l'évènement à déclencher.",
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        {
                            name: "GuildCreate",
                            value: Events.GuildCreate,
                        },
                        {
                            name: "GuildDelete",
                            value: Events.GuildDelete,
                        },
                    ],
                },
            ],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const event = interaction.options.getString("event");

        if (event == Events.GuildCreate || event == Events.GuildDelete) {
            this.client.emit(event, interaction.guild as Guild);
        }

        interaction.reply({
            embeds: [new EmbedBuilder().setColor("Green").setDescription(`✅ Évènement \`${event}\` déclenché avec succès.`)],
            ephemeral: true,
        });
    }
}
