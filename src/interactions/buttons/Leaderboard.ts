import { ButtonInteraction, ComponentType, EmbedBuilder, PermissionFlagsBits } from "discord.js";

import CustomClient from "../../base/classes/CustomClient";
import Interaction from "../../base/classes/Interaction";

import UserConfig from "../../base/schemas/UserConfig";

import { getLevelPrestige } from "../../utils/getLevel";

export default class Leaderboard extends Interaction {
    constructor(client: CustomClient) {
        super(client, {
            name: "leaderboard",
            permissions: PermissionFlagsBits.UseApplicationCommands,
            cooldown: 10,
            type: ComponentType.Button,
        });
    }

    async Execute(interaction: ButtonInteraction) {
        const users = await UserConfig.find({ guildId: interaction.guild?.id })
            .sort([
                ["level.level", -1],
                ["level.xp", -1],
            ])
            .limit(10);

        const ranking = users.map((user, index) => {
            const prestige = getLevelPrestige(user.level.level || 1);

            return {
                rank: index + 1,
                user: user.userId,
                level: prestige > 0 ? `Prestige \`${prestige}\` - \`${user.level.level || 1}\`` : `Niveau \`${user.level.level || 1}\``,
                xp: user.level.xp || 1,
            };
        });

        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(this.client.config.color)
                    .setAuthor({ name: `Leaderboard - ${interaction.guild?.name}` })
                    .setThumbnail(interaction.guild?.iconURL()!)
                    .setDescription(ranking.map((user) => `\`${user.rank}\`. <@${user.user}> - ${user.level}  (\`${user.xp}\` xp)`).join("\n")),
            ],
            ephemeral: true,
        });
    }
}
