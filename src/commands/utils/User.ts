import { ApplicationCommandOptionType, ChatInputCommandInteraction, EmbedBuilder, GuildMember, PermissionFlagsBits } from "discord.js";

import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";

import Category from "../../base/enums/Category";

export default class User extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "user",
            description: "Avoir des informations sur un utilisateur.",
            category: Category.Utilities,
            default_member_permissions: PermissionFlagsBits.UseApplicationCommands,
            dm_permission: false,
            cooldown: 3,
            options: [
                {
                    name: "target",
                    description: "Utilisateur dont afficher les informations.",
                    type: ApplicationCommandOptionType.User,
                    required: false,
                },
            ],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const target = (interaction.options.getMember("target") || interaction.member) as GuildMember;

        await interaction.deferReply({ ephemeral: true });

        const fetchMember = await target.fetch();

        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(fetchMember.user.accentColor ?? this.client.config.color)
                    .setAuthor({ name: `${fetchMember.user.tag}`, iconURL: fetchMember.user.displayAvatarURL() })
                    .setThumbnail(fetchMember.user.displayAvatarURL())
                    .setDescription(
                        `
                        **Utilisateur** :
                        > ID : \`${fetchMember.user.id}\`
                        > Robot : \`${fetchMember.user.bot ? "Oui" : "Non"}\`
                        > Création du compte : <t:${parseInt((fetchMember.user.createdTimestamp / 1000).toFixed(0))}:R>

                        **Membre** :
                        > Surnom : \`${fetchMember.nickname || fetchMember.user.username}\`
                        > Rôles (${fetchMember.roles.cache.size - 1}) : ${
                            fetchMember.roles.cache
                                .map((role) => role)
                                .join(", ")
                                .replace("@everyone", "") || "Aucun"
                        }
                        > Administrateur : \`${fetchMember.permissions.has(PermissionFlagsBits.Administrator) ? "Oui" : "Non"}\`
                        > Rejoint le serveur : <t:${parseInt((fetchMember.joinedTimestamp! / 1000).toFixed(0))}:R>
                        > Position : \`${this.GetJoinPosition(interaction, fetchMember)! + 1}\` / \`${interaction.guild?.memberCount}\`
                        `
                    ),
            ],
        });
    }

    private GetJoinPosition(interaction: ChatInputCommandInteraction, target: GuildMember) {
        let pos = null;
        const joinPosition = interaction.guild?.members.cache.sort((a, b) => a.joinedTimestamp! - b.joinedTimestamp!)!;

        Array.from(joinPosition).find((member, index) => {
            if (member[0] == target.user.id) {
                pos = index;
            }
        });

        return pos;
    }
}
