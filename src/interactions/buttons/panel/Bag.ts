import { ButtonInteraction, ComponentType, EmbedBuilder, PermissionFlagsBits } from "discord.js";

import CustomClient from "../../../base/classes/CustomClient";
import Interaction from "../../../base/classes/Interaction";

import UserConfig from "../../../base/schemas/UserConfig";

export default class Bag extends Interaction {
    constructor(client: CustomClient) {
        super(client, {
            name: "panel_bag",
            permissions: PermissionFlagsBits.UseApplicationCommands,
            cooldown: 3,
            type: ComponentType.Button,
        });
    }

    async Execute(interaction: ButtonInteraction) {
        const userDB = await UserConfig.findOne({ userId: interaction.user.id, guildId: interaction.guild?.id });

        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(interaction.message.embeds[0].color)
                    .setAuthor({ name: "Inventaire", iconURL: "https://i.imgur.com/7BwnQRs.png" })
                    .setDescription(
                        `Votre collection d'armes et d'objets est visible par tous les membres du serveur. Vous pourrez prochainement les échanger entre vous dans un marché dédié.\n\n${
                            userDB?.inventory.content.length! > 0
                                ? userDB?.inventory.content
                                      .map((item) => `- ${item.rarity.split(" ")[0]} | \`${item.name}\` - x${item.quantity}`)
                                      .join("\n")
                                : "**Vous n'avez pas d'objets dans votre inventaire.**"
                        }`
                    ),
            ],
            ephemeral: true,
            components: [],
            files: [],
        });
    }
}
