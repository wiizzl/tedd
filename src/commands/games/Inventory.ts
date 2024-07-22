import { ApplicationCommandOptionType, ChatInputCommandInteraction, EmbedBuilder, GuildMember, PermissionFlagsBits } from "discord.js";

import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";

import Category from "../../base/enums/Category";
import UserConfig from "../../base/schemas/UserConfig";

export default class Inventory extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "inventory",
            description: "Afficher l'inventaire d'un utilisateur.",
            category: Category.Games,
            default_member_permissions: PermissionFlagsBits.UseApplicationCommands,
            dm_permission: false,
            cooldown: 3,
            options: [
                {
                    name: "target",
                    description: "Utilisateur dont afficher l'inventaire.",
                    type: ApplicationCommandOptionType.User,
                    required: false,
                },
            ],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const target = (interaction.options.getMember("target") || interaction.member) as GuildMember;
        const userDB = await UserConfig.findOne({ userId: target.id, guildId: target.guild.id });

        if (!userDB) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription("❌ Cet utilisateur n'a pas encore créé de profil. Il doit d'abord utiliser la commande */panel*."),
                ],
                ephemeral: true,
            });
        }

        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor((await target.user.fetch()).accentColor ?? this.client.config.color)
                    .setAuthor({ name: `Inventaire de ${target.user.displayName}`, iconURL: target.user.avatarURL()! })
                    .setDescription(
                        `Mention : ${target}\n\n${
                            userDB?.inventory.content.length! > 0
                                ? userDB?.inventory.content
                                      .map((item) => `- ${item.rarity.split(" ")[0]} | \`${item.name}\` - x${item.quantity}`)
                                      .join("\n")
                                : `**${target} n'a pas d'objets dans son inventaire.**`
                        }`
                    ),
            ],
            ephemeral: true,
        });
    }
}
