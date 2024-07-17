import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import ms from "ms";
import os from "os";

import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";

import Category from "../../base/enums/Category";

import { dependencies, version } from "../../../package.json";

export default class Bot extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "bot",
            description: "Afficher les informations sur le robot.",
            category: Category.Utilities,
            default_member_permissions: PermissionFlagsBits.UseApplicationCommands,
            dm_permission: true,
            cooldown: 3,
            options: [],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(this.client.config.color)
                    .setThumbnail(this.client.user?.displayAvatarURL()!)
                    .setDescription(
                        `
                        **Robot** :
                        > ID : \`${this.client.user?.id}\`
                        > Création du compte : <t:${parseInt((this.client.user!.createdTimestamp / 1000).toFixed(0))}:R>
                        > Commandes : \`${this.client.commands.size}\`
                        > Version : \`${version}\`
                        > Version de NodeJS : \`${process.version}\`
                        > Dépendances (${Object.keys(dependencies).length}) : \`${Object.keys(dependencies)
                            // @ts-ignore
                            .map((d) => `${d}@${dependencies[d]}`.replace(/\^/g, ""))
                            .join(", ")}\`
                        > Temps d'allumage : \`${ms(this.client.uptime!, { long: false })}\`

                        **Système** :
                        > Système d'exploitation : \`${process.platform}\`
                        > CPU : \`${os.cpus()[0].model.trim()}\`
                        > Utilisation de la mémoire: \`${this.formatBytes(process.memoryUsage().heapUsed)}\` / \`${this.formatBytes(os.totalmem())}\`

                        **Équipe de développement** :
                        > Propriétaire : \`Serveur Zombie Zone\`
                        > Développeur : \`wiizz\`
                        `
                    ),
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents([
                    new ButtonBuilder().setLabel("Site web").setStyle(ButtonStyle.Link).setURL("https://zombie-zone.net"),
                    new ButtonBuilder().setLabel("Discord").setStyle(ButtonStyle.Link).setURL("https://discord.gg/zngVd8pczz"),
                ]),
            ],
            ephemeral: true,
        });
    }

    private formatBytes(bytes: number) {
        if (bytes == 0) return "0";

        const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));

        return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
    }
}
