import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentType, EmbedBuilder, PermissionFlagsBits } from "discord.js";

import CustomClient from "../../../base/classes/CustomClient";
import Interaction from "../../../base/classes/Interaction";

export default class Custom extends Interaction {
    constructor(client: CustomClient) {
        super(client, {
            name: "panel_custom",
            permissions: PermissionFlagsBits.UseApplicationCommands,
            cooldown: 3,
            type: ComponentType.Button,
        });
    }

    async Execute(interaction: ButtonInteraction) {
        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(interaction.message.embeds[0].color)
                    .setAuthor({ name: "Personnalisation", iconURL: "https://i.imgur.com/b5dv4PF.png" })
                    .setDescription(
                        "Votre bannière et votre tag de clan sont visible par tous les membres du serveur. Pour le moment, il n'est pas possible d'utiliser de bannière personnalisée."
                    )
                    .addFields([
                        {
                            name: "<:banner:1265320635152728156> Bannière",
                            value: `Il vous sera demandé d'entrer le nom de la bannière que vous souhaitez équiper.`,
                        },
                        {
                            name: "<:clan:1264935707592622162> Tag de clan",
                            value: "Il vous sera demandé d'entrer le tag de clan que vous souhaitez utiliser. Le tag de clan doit faire 4 caractères maximum et 2 caractères au minimum.",
                        },
                    ]),
            ],
            ephemeral: true,
            components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setLabel("Bannière")
                        .setEmoji("<:banner:1265320635152728156>")
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId("custom_banner"),
                    new ButtonBuilder()
                        .setLabel("Tag")
                        .setEmoji("<:clan:1264935707592622162>")
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId("custom_tag")
                ),
            ],
            files: [],
        });
    }
}
