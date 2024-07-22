import {
    ApplicationCommandOptionType,
    AttachmentBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    GuildMember,
    PermissionFlagsBits,
} from "discord.js";

import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";

import Category from "../../base/enums/Category";
import UserConfig from "../../base/schemas/UserConfig";

import { drawBanner } from "../../utils/drawBanner";
import { getLevelPrestige } from "../../utils/getLevel";

export default class Profile extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "profile",
            description: "Afficher le profil d'un utilisateur.",
            category: Category.Games,
            default_member_permissions: PermissionFlagsBits.UseApplicationCommands,
            dm_permission: false,
            cooldown: 3,
            options: [
                {
                    name: "target",
                    description: "Utilisateur dont afficher le profil.",
                    type: ApplicationCommandOptionType.User,
                    required: false,
                },
            ],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const target = (interaction.options.getMember("target") || interaction.member) as GuildMember;
        const userDB = await UserConfig.findOne({ userId: target.id, guildId: target.guild.id });

        if (!userDB) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription("❌ Cet utilisateur n'a pas encore créé de profil. Il doit d'abord utiliser la commande */panel*."),
                ],
            });
        }

        const attachment = new AttachmentBuilder(await drawBanner(target, userDB)).setName(`${target.user.username}_profile.png`);
        const prestige = getLevelPrestige(userDB?.level.level || 1);

        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor((await target.user.fetch()).accentColor ?? this.client.config.color)
                    .setAuthor({ name: `Profile de ${target.user.displayName}`, iconURL: target.user.avatarURL()! })
                    .setDescription(`Mention : ${target}`)
                    .addFields([
                        { name: "<:credit:1264690330570195074> Crédit", value: `Montant : \`${userDB?.credit || 0}\``, inline: true },
                        {
                            name: "<:xp:1264640839267913849> Grade",
                            value: `${
                                prestige > 0 ? `Prestige \`${prestige}\` - \`${userDB?.level.level || 1}\`` : `Niveau \`${userDB?.level.level || 1}\``
                            }`,
                            inline: true,
                        },
                        {
                            name: "<:clan:1264935707592622162> Clan",
                            value: `Tag : [\`${userDB?.clan || "Aucun"}\`]`,
                            inline: true,
                        },
                    ])
                    .setImage(`attachment://${target.user.username}_profile.png`),
            ],
            files: [attachment],
        });
    }
}
