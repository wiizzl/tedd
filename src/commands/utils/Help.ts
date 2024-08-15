import {
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
    EmbedBuilder,
    GuildMember,
    PermissionFlagsBits,
    PermissionsBitField,
} from "discord.js";

import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";

import Category from "../../base/enums/Category";
import Emojis from "../../base/enums/Emojis";

export default class Help extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "help",
            description: "Afficher le message d'aide.",
            category: Category.Utilities,
            default_member_permissions: PermissionFlagsBits.UseApplicationCommands,
            dm_permission: false,
            cooldown: 3,
            options: [
                {
                    name: "command",
                    description: "Nom de la commande dont afficher plus de détails.",
                    type: ApplicationCommandOptionType.String,
                    required: false,
                },
            ],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        let command;
        if (interaction.options.getString("command")) {
            command = this.client.commands.get(interaction.options.getString("command")!);

            if (!command) {
                return await interaction.reply({
                    embeds: [new EmbedBuilder().setColor("Red").setDescription(`${Emojis.Cross} Cette commande n'existe pas.`)],
                    ephemeral: true,
                });
            }
        }

        const target = interaction.member as GuildMember;
        const fetchMember = await target.fetch();

        if (!command) {
            const activeCmds = this.client.commands.map((cmd) =>
                fetchMember.permissions.has(new PermissionsBitField(cmd.default_member_permissions))
            );
            const output = activeCmds.filter((cmd) => cmd === true);

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
                .setDescription(`Commandes du robot : \`${this.client.commands.size}\`\nCommandes disponibles pour vous : \`${output.length}\``);

            categories.sort().forEach(async (cat) => {
                const commands = this.client.commands.filter((cmd) => cmd.category === cat);
                const categoryEmpty = commands.map((cmd) => fetchMember.permissions.has(new PermissionsBitField(cmd.default_member_permissions)));

                if (categoryEmpty.every((element) => element === false)) return;

                Embed.addFields({
                    name: `${cat}`,
                    value: `>>> ${commands
                        .map(
                            (cmd) =>
                                `${
                                    fetchMember.permissions.has(new PermissionsBitField(cmd.default_member_permissions))
                                        ? `\`/${cmd.name}\` : ${cmd.description}\n`
                                        : ""
                                }`
                        )
                        .join("")}`,
                });
            });

            return await interaction.reply({ embeds: [Embed], ephemeral: true });
        }

        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(this.client.config.color)
                    .setTitle(`Commandes ${command.name}`)
                    .setThumbnail(this.client.user?.displayAvatarURL()!)
                    .setDescription(
                        `Nom : \`/${command.name}\`\nDescription : \`${command.description}\`\nPermission requise : \`${
                            typeof command.default_member_permissions !== "bigint"
                                ? command.default_member_permissions
                                : new PermissionsBitField(command.default_member_permissions).toArray()
                        }\`\nCommande en MP : \`${command.dm_permission ? "Oui" : "Non"}\`\nCatégorie : \`${command.category}\``
                    ),
            ],
            ephemeral: true,
        });
    }
}
