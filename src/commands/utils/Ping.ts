import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    ColorResolvable,
    EmbedBuilder,
    PermissionFlagsBits,
} from "discord.js";

import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";

import Category from "../../base/enums/Category";

export default class Ping extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "ping",
            description: "Obtenir la latence du robot.",
            category: Category.Utilities,
            default_member_permissions: PermissionFlagsBits.UseApplicationCommands,
            dm_permission: true,
            cooldown: 3,
            options: [],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const ping = this.client.ws.ping;

        let color: ColorResolvable;
        if (ping < 50) {
            color = "Green";
        } else if (ping < 100) {
            color = "Orange";
        } else {
            color = "Red";
        }

        return await interaction.reply({
            embeds: [new EmbedBuilder().setColor(color).setDescription(`🏓 Pong : \`${ping}ms\``)],
            components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder().setLabel("Rafraîchir").setEmoji("🔄").setStyle(ButtonStyle.Secondary).setCustomId("ping")
                ),
            ],
            ephemeral: true,
        });
    }
}
