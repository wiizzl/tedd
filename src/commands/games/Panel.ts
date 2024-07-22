import {
    ActionRowBuilder,
    AttachmentBuilder,
    ButtonBuilder,
    ButtonStyle,
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

export default class Panel extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "panel",
            description: "Afficher le panel de jeu.",
            category: Category.Games,
            default_member_permissions: PermissionFlagsBits.UseApplicationCommands,
            dm_permission: false,
            cooldown: 3 * 60,
            options: [],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const member = interaction.member as GuildMember;
        const userDB = await UserConfig.findOne({ userId: member.id, guildId: member.guild.id });

        if (!userDB) {
            await UserConfig.create({ userId: member.id, guildId: member.guild.id });
        }

        const attachment = new AttachmentBuilder(await drawBanner(member, userDB)).setName(`${member.user.username}_panel.png`);
        const prestige = getLevelPrestige(userDB?.level.level || 1);

        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor((await member.user.fetch()).accentColor ?? this.client.config.color)
                    .setAuthor({
                        name: `Panel de ${interaction.user.displayName} - ${interaction.guild?.name}`,
                        iconURL: interaction.user.displayAvatarURL(),
                    })
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
                        {
                            name: "<:braderie:1264690409263595673> Boîte mystère",
                            value: "Ce jeu aléatoire vous permettra d'échanger vos crédits contre de l'expérience et une arme qui ira dans votre inventaire.",
                            inline: false,
                        },
                        {
                            name: "<:craft:1264690078975000576> Établi",
                            value: "Ce menu de fabrication vous permettra de construire des armes et des objets à partir de matériaux récoltés lors d'évènements.",
                            inline: false,
                        },
                        {
                            name: "<:shop:1264690102597189845> Boutique",
                            value: "Ce menu vous permettra d'acheter des objets spéciaux.",
                            inline: false,
                        },
                        {
                            name: "<:pinceau:1264690139037302855> Personnalisation",
                            value: "Ce menu vous permettra de modifier diverses informations de votre profil.",
                            inline: false,
                        },
                    ])
                    .setImage(`attachment://${member.user.username}_panel.png`),
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setLabel(`Inventaire (${userDB?.inventory.content.length || 0}/${userDB?.inventory.size || 50})`)
                        .setEmoji("<:inventaire:1264690052655616070>")
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId("panel_bag"),
                    new ButtonBuilder()
                        .setLabel("Boîte mystère")
                        .setEmoji("<:braderie:1264690409263595673>")
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId("panel_box"),
                    new ButtonBuilder()
                        .setLabel("Établi")
                        .setEmoji("<:craft:1264690078975000576>")
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId("panel_craft"),
                    new ButtonBuilder()
                        .setLabel("Boutique")
                        .setEmoji("<:shop:1264690102597189845>")
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId("panel_shop"),
                    new ButtonBuilder()
                        .setLabel("Personnalisation")
                        .setEmoji("<:pinceau:1264690139037302855>")
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId("panel_custom")
                ),
            ],
            files: [attachment],
        });
    }
}
