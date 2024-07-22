import { ApplicationCommandOptionType, ChatInputCommandInteraction, EmbedBuilder, GuildMember, PermissionFlagsBits } from "discord.js";

import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";

import Category from "../../base/enums/Category";
import UserConfig from "../../base/schemas/UserConfig";

import { getLevelPrestige, getLevelXp } from "../../utils/getLevel";

export default class Rank extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "rank",
            description: "Afficher le rank d'un utilisateur.",
            category: Category.Games,
            default_member_permissions: PermissionFlagsBits.UseApplicationCommands,
            dm_permission: false,
            cooldown: 3,
            options: [
                {
                    name: "target",
                    description: "Utilisateur dont afficher le rank.",
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
                        .setDescription("❌ Cet utilisateur n'a pas encore gagné d'expérience. Il doit d'abord envoyer un message dans un salon."),
                ],
                ephemeral: true,
            });
        }

        const prestige = getLevelPrestige(userDB?.level.level || 1);

        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor((await target.user.fetch()).accentColor ?? this.client.config.color)
                    .setAuthor({ name: `Rank de ${target.user.displayName}`, iconURL: target.user.avatarURL()! })
                    .setDescription(
                        `Mention : ${target}\n\n${
                            prestige > 0
                                ? `Prestige \`${prestige}\` - \`${userDB?.level.level || 1}\``
                                : `Niveau \`${userDB?.level.level || 1}\` (\`${userDB?.level.xp || 1}\`/\`${getLevelXp(
                                      userDB?.level.level || 1
                                  )}\` xp)`
                        }\n\n${this.drawProgress(userDB?.level.xp || 1, getLevelXp(userDB?.level.level || 1), 20)}`
                    ),
            ],
            ephemeral: true,
        });
    }

    private drawProgress(value: number, maxValue: number, size: number) {
        const fullBar = "<:br2:1264948161521258497>";
        const emptyBar = "<:bv2:1264948092113780847>";
        const startBar = "<:br1:1264948141682327623>";
        const endBarFull = "<:br3:1264948185739296809>";
        const endBarEmpty = "<:bv3:1264948110723907697>";

        let progress = Math.round((value / maxValue) * size);
        let bar = startBar;

        for (let i = 0; i < size; i++) {
            if (i < progress) {
                bar += fullBar;
            } else {
                bar += emptyBar;
            }
        }

        if (progress === size) {
            bar += endBarFull;
        } else {
            bar += endBarEmpty;
        }

        return bar;
    }
}
