import { ButtonInteraction, ComponentType, EmbedBuilder, Message, PermissionFlagsBits } from "discord.js";

import CustomClient from "../../../../base/classes/CustomClient";
import Interaction from "../../../../base/classes/Interaction";

import UserConfig from "../../../../base/schemas/UserConfig";

import Emojis from "../../../../base/enums/Emojis";

import data from "../../../../../data/profile.json";

export default class Banner extends Interaction {
    constructor(client: CustomClient) {
        super(client, {
            name: "custom_banner",
            permissions: PermissionFlagsBits.UseApplicationCommands,
            cooldown: 3,
            type: ComponentType.Button,
        });
    }

    async Execute(interaction: ButtonInteraction) {
        const mess = await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(interaction.message.embeds[0].color)
                    .setAuthor({ name: "Bannière", iconURL: "https://i.imgur.com/SNo6PPy.png" })
                    .setDescription("Merci d'entrer le nom de la bannière que vous souhaitez utiliser."),
            ],
            ephemeral: true,
            components: [],
            files: [],
        });

        const filter = (m: Message) => m.author.id === interaction.user.id;
        const collector = interaction.channel?.createMessageCollector({ filter, max: 1, time: 15000 });

        collector?.on("collect", async (message: Message) => {
            const bannerName = message.content;
            const bannerExist = data.find((g) => g.banner.some((b) => b.name === bannerName));

            message.delete();

            if (!bannerExist) {
                return await mess.edit({
                    embeds: [new EmbedBuilder().setColor("Red").setDescription(`${Emojis.Cross} Ce nom de bannière n'existe pas.`)],
                });
            }

            const banner = bannerExist.banner.find((b) => b.name === bannerName);

            await UserConfig.updateOne({ userId: interaction.user.id, guildId: interaction.guildId }, { banner: banner?.url });

            return await mess.edit({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Green")
                        .setDescription(
                            `${Emojis.Tick} La bannière \`${banner?.name}\` (\`${bannerExist.name}\`) est valide et a été appliquée à votre profil.`
                        ),
                ],
            });
        });

        collector?.on("end", async (collected, reason) => {
            if (reason === "time") {
                return await mess.edit({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Red")
                            .setDescription(`${Emojis.Cross} Vous n'avez pas donné de nom de bannière durant les 15 précédentes secondes.`),
                    ],
                });
            }
        });
    }
}
