import { ButtonInteraction, ComponentType, EmbedBuilder, Message, PermissionFlagsBits } from "discord.js";

import CustomClient from "../../../../base/classes/CustomClient";
import Interaction from "../../../../base/classes/Interaction";

import Emojis from "../../../../base/enums/Emojis";

import UserConfig from "../../../../base/schemas/UserConfig";

export default class Tag extends Interaction {
    constructor(client: CustomClient) {
        super(client, {
            name: "custom_tag",
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
                    .setAuthor({ name: "Tag de clan", iconURL: "https://i.imgur.com/XtyhBbT.png" })
                    .setDescription("Merci d'entrer le tag de clan que vous souhaitez utiliser."),
            ],
            ephemeral: true,
            components: [],
            files: [],
        });

        const filter = (m: Message) => m.author.id === interaction.user.id;
        const collector = interaction.channel?.createMessageCollector({ filter, max: 1, time: 15000 });

        collector?.on("collect", async (message: Message) => {
            const tagName = message.content;

            message.delete();

            if (!/^.{2,4}$/.test(tagName)) {
                return await mess.edit({
                    embeds: [new EmbedBuilder().setColor("Red").setDescription(`${Emojis.Cross} Le tag doit faire entre 2 et 4 caractères.`)],
                });
            }

            await UserConfig.updateOne({ userId: interaction.user.id, guildId: interaction.guildId }, { $set: { "clan.tag": tagName } });

            return await mess.edit({
                embeds: [new EmbedBuilder().setColor("Green").setDescription(`${Emojis.Tick} Le tag \`${tagName}\` a été appliqué à votre profil.`)],
            });
        });

        collector?.on("end", async (collected, reason) => {
            if (reason === "time") {
                return await mess.edit({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Red")
                            .setDescription(`${Emojis.Cross} Vous n'avez pas donné de tag de clan durant les 15 précédentes secondes.`),
                    ],
                });
            }
        });
    }
}
