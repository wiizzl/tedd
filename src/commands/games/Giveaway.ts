import {
    ActionRowBuilder,
    ApplicationCommandOptionType,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    ComponentType,
    EmbedBuilder,
    PermissionFlagsBits,
} from "discord.js";
import ms from "ms";

import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";

import Category from "../../base/enums/Category";
import Emojis from "../../base/enums/Emojis";

export default class Giveaway extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "giveaway",
            description: "Créer un giveaway.",
            category: Category.Games,
            default_member_permissions: PermissionFlagsBits.ManageEvents,
            dm_permission: false,
            cooldown: 5,
            options: [
                {
                    name: "prize",
                    type: ApplicationCommandOptionType.String,
                    description: "Ce qui est à gagner.",
                    required: true,
                },
                {
                    name: "duration",
                    description: "La durée du giveaway (par défaut, 1 semaine).",
                    type: ApplicationCommandOptionType.String,
                    required: false,
                    choices: [
                        { name: "5 minutes", value: "5m" },
                        { name: "10 minutes", value: "10m" },
                        { name: "15 minutes", value: "15m" },
                        { name: "30 minutes", value: "30m" },
                        { name: "45 minutes", value: "45m" },
                        { name: "1 heure", value: "1h" },
                        { name: "2 heures", value: "2h" },
                        { name: "6 heures", value: "6h" },
                        { name: "12 heures", value: "12h" },
                        { name: "1 jour", value: "1d" },
                        { name: "3 jour", value: "3d" },
                        { name: "5 jour", value: "5d" },
                        { name: "1 semaine", value: "1w" },
                        { name: "2 semaine", value: "2w" },
                        { name: "3 semaine", value: "3w" },
                        { name: "4 semaine", value: "4w" },
                    ],
                },
                {
                    name: "winners",
                    type: ApplicationCommandOptionType.Integer,
                    description: "Le nombre de gagnants (par défaut, 1).",
                    required: false,
                    choices: [
                        { name: "1", value: 1 },
                        { name: "2", value: 2 },
                        { name: "3", value: 3 },
                        { name: "4", value: 4 },
                        { name: "5", value: 5 },
                        { name: "6", value: 6 },
                        { name: "7", value: 7 },
                        { name: "8", value: 8 },
                        { name: "9", value: 9 },
                        { name: "10", value: 10 },
                    ],
                },
            ],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const duration = interaction.options.getString("duration") || "1w";
        const winners = interaction.options.getInteger("winners") || 1;
        const prize = interaction.options.getString("prize");

        const msDuration = ms(duration);
        const endTime = Date.now() + msDuration;

        const joinButton = new ButtonBuilder()
            .setLabel("Participer")
            .setStyle(ButtonStyle.Success)
            .setEmoji("🎉")
            .setCustomId("giveaway_participate");
        const leaveButton = new ButtonBuilder().setLabel("Quitter").setStyle(ButtonStyle.Danger).setEmoji("🚪").setCustomId("giveaway_leave");
        const listButton = new ButtonBuilder()
            .setLabel("Liste des participants")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("📜")
            .setCustomId("giveaway_list");

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(this.client.config.color)
                    .setThumbnail("https://i.imgur.com/iqLAAYT.png")
                    .setTitle("Création d'un giveaway !")
                    .setDescription(`⏱️ Fin : <t:${Math.floor(endTime / 1000)}:R>\n🎖️ Nombre de gagnants : \`${winners}\`\n\n🏆 Prix :\n\`${prize}\``)
                    .setTimestamp(),
            ],
            components: [new ActionRowBuilder<ButtonBuilder>().addComponents(joinButton, leaveButton, listButton)],
        });

        const reply = await interaction.fetchReply();

        let participants: string[] = [];
        const collector = reply.createMessageComponentCollector({ componentType: ComponentType.Button, time: msDuration });

        collector.on("collect", async (interaction) => {
            if (interaction.customId === "giveaway_participate") {
                if (participants.includes(interaction.user.id)) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("Red")
                                .setDescription(`${Emojis.Cross} Vous êtes déjà dans la liste des participants de ce giveaway.`),
                        ],
                        ephemeral: true,
                    });
                }

                participants.push(interaction.user.id);
                await interaction.reply({
                    embeds: [new EmbedBuilder().setColor("Green").setDescription(`${Emojis.Tick} Votre participation a bien été prise en compte !`)],
                    ephemeral: true,
                });

                joinButton.setLabel(`Participer (${participants.length})`);
                return await reply.edit({
                    components: [new ActionRowBuilder<ButtonBuilder>().addComponents(joinButton, leaveButton, listButton)],
                });
            }

            if (interaction.customId === "giveaway_leave") {
                if (!participants.includes(interaction.user.id)) {
                    return await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("Red")
                                .setDescription(`${Emojis.Cross} Vous n'êtes pas dans la liste des participants de ce giveaway.`),
                        ],
                        ephemeral: true,
                    });
                }

                participants.splice(participants.indexOf(interaction.user.id), 1);
                await interaction.reply({
                    embeds: [new EmbedBuilder().setColor("Green").setDescription(`${Emojis.Tick} Votre participation a bien été retirée !`)],
                    ephemeral: true,
                });

                joinButton.setLabel(`Participer (${participants.length})`);
                await reply.edit({
                    components: [new ActionRowBuilder<ButtonBuilder>().addComponents(joinButton, leaveButton, listButton)],
                });
            }

            if (interaction.customId === "giveaway_list") {
                const list = participants.map((id) => `- <@${id}>`).join("\n");

                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Green")
                            .setDescription(
                                `${Emojis.Tick} Ce giveaway compte \`${participants.length}\` participant(s).\n${list.length > 0 ? list : ""}`
                            ),
                    ],
                    ephemeral: true,
                });
            }
        });

        collector.on("end", async (collected, reason) => {
            if (reason === "time") {
                joinButton.setDisabled(true);
                leaveButton.setDisabled(true);

                let winnerIds = [];
                for (let i = 0; i < winners; i++) {
                    const winnerIndex = Math.floor(Math.random() * participants.length);

                    winnerIds.push(participants[winnerIndex]);
                    participants.splice(winnerIndex, 1);
                }

                interaction.editReply({
                    content: `||${winnerIds.map((id) => `<@${id}>`).join(" ")}||`,
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Red")
                            .setThumbnail(reply.embeds[0].thumbnail?.url!)
                            .setTitle("Giveaway terminé !")
                            .setDescription(
                                `⏱️ Fin : <t:${Math.floor(
                                    endTime / 1000
                                )}:R>\n🎖️ Nombre de gagnants : \`${winners}\`\n\n🏆 Prix :\n\`${prize}\`\n\n🙎 Gagnant(s) :\n${winnerIds
                                    .map((id) => `- <@${id}>`)
                                    .join("\n")}`
                            )
                            .setFooter({
                                text: "Merci aux gagnants de créer un ticket rapidement.",
                                iconURL: interaction.guild?.iconURL()!,
                            }),
                    ],
                    components: [new ActionRowBuilder<ButtonBuilder>().addComponents(joinButton, leaveButton)],
                });
            }
        });
    }
}
