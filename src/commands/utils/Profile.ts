import { profileImage } from "discord-arts";
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

export default class Profile extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "profile",
            description: "Afficher le profil d'un utilisateur.",
            category: Category.Utilities,
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
        const target = (interaction.options.getMember("target") || interaction.member) as GuildMember;

        await interaction.deferReply({ ephemeral: true });

        const buffer = await profileImage(target.id, {
            badgesFrame: true,
            removeAvatarFrame: false,
            presenceStatus: target.presence?.status,
        });

        const attachment = new AttachmentBuilder(buffer).setName(`${target.user.username}_profile.png`);
        const colour = (await target.user.fetch()).accentColor;

        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(colour ?? this.client.config.color)
                    .setDescription(`Profile de ${target}`)
                    .setImage(`attachment://${target.user.username}_profile.png`),
            ],
            files: [attachment],
        });
    }
}
