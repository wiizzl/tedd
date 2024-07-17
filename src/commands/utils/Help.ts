import { ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from "discord.js";

import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";

import Category from "../../base/enums/Category";

export default class Help extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "help",
            description: "Afficher le message d'aide.",
            category: Category.Utilities,
            default_member_permissions: PermissionFlagsBits.UseApplicationCommands,
            dm_permission: true,
            cooldown: 3,
            options: [],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        let categories: string[] = [];

        this.client.commands.forEach((command) => {
            if (!categories.includes(command.category)) {
                categories.push(command.category);
            }
        });

        const Embed = new EmbedBuilder()
            .setColor(this.client.config.color)
            .setTitle("Liste des commandes :")
            .setThumbnail(this.client.user?.displayAvatarURL()!)
            .setDescription(`Commandes : \`${this.client.commands.size}\`\nCatégories : \`${categories.length}\``);

        categories.sort().forEach(async (cat) => {
            const commands = this.client.commands.filter((cmd) => cmd.category === cat);

            Embed.addFields({
                name: `${cat} :`,
                value: `${commands.map((cmd) => `\`${cmd.name}\` : ${cmd.description}`).join("\n")}`,
            });
        });

        return await interaction.reply({ embeds: [Embed], ephemeral: true });
    }
}
